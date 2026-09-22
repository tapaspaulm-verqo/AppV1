import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../theme/verqo_theme.dart';
import '../../utils/money.dart';
import 'dashboard_widgets.dart';

/// Client's personalised post-login view — GET /api/v1/dashboard/client
/// (DashboardController.Client). Contractors, project delivery/payment
/// milestones, escrow balance, pending payment-release approvals, finding
/// new contractors and creating new projects all live here, same
/// data/shape as the web app's ClientDashboardComponent.
class ClientDashboardScreen extends StatefulWidget {
  const ClientDashboardScreen({super.key});

  @override
  State<ClientDashboardScreen> createState() => _ClientDashboardScreenState();
}

class _ClientDashboardScreenState extends State<ClientDashboardScreen> {
  final _api = ApiClient();
  late Future<ClientDashboard> _future;

  String? _acting;
  List<FreelancerListItem>? _freelancers;
  bool _searching = false;

  @override
  void initState() {
    super.initState();
    _future = _load();
    _searchFreelancers();
  }

  Future<ClientDashboard> _load() {
    final token = AuthService.instance.token;
    if (token == null) return Future.error(ApiException(401, 'No session'));
    return _api.getClientDashboard(token);
  }

  Future<void> _refresh() async {
    final next = _load();
    setState(() => _future = next);
    await next;
  }

  Future<void> _searchFreelancers({String? q}) async {
    final token = AuthService.instance.token;
    if (token == null) return;
    setState(() => _searching = true);
    try {
      final list = await _api.searchFreelancers(token, q: q);
      if (mounted) setState(() => _freelancers = list);
    } catch (_) {
      // Leave the previous list (or none) in place — this card fails
      // quietly rather than blocking the rest of the dashboard.
    } finally {
      if (mounted) setState(() => _searching = false);
    }
  }

  Future<void> _fund(String milestoneId) async {
    final token = AuthService.instance.token;
    if (token == null) return;
    setState(() => _acting = milestoneId);
    try {
      await _api.fundMilestone(token, milestoneId);
      await _refresh();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text("Couldn't fund that milestone — try again.")));
      }
    } finally {
      if (mounted) setState(() => _acting = null);
    }
  }

  Future<void> _approve(String milestoneId) async {
    final token = AuthService.instance.token;
    if (token == null) return;
    setState(() => _acting = milestoneId);
    try {
      await _api.approveMilestone(token, milestoneId);
      await _refresh();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text("Couldn't release that payment — try again.")));
      }
    } finally {
      if (mounted) setState(() => _acting = null);
    }
  }

  Future<void> _createProject() async {
    final result = await showModalBottomSheet<_ProjectDraft>(
      context: context,
      isScrollControlled: true,
      builder: (_) => const _CreateProjectSheet(),
    );
    if (result == null) return;

    final token = AuthService.instance.token;
    if (token == null) return;
    try {
      await _api.createJob(
        token,
        title: result.title,
        description: result.description,
        roleCategory: result.roleCategory,
        budgetMinorMin: result.budgetMinorMin,
        budgetMinorMax: result.budgetMinorMax,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Project posted — freelancers can now apply.')));
      }
      await _refresh();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text("Couldn't post that project — check the required fields.")));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Log out',
            onPressed: () => AuthService.instance.logout(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: FutureBuilder<ClientDashboard>(
          future: _future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError || !snapshot.hasData) {
              return ListView(
                children: const [
                  SizedBox(height: 120),
                  Center(child: Text("Couldn't load your dashboard — pull down to try again.")),
                ],
              );
            }
            final d = snapshot.data!;
            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(d.companyName, style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 4),
                Text('${d.plan} plan${d.gstin != null ? ' · GSTIN on file' : ''}',
                    style: const TextStyle(color: VerqoColors.inkSecondary)),
                const SizedBox(height: 20),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.6,
                  children: [
                    StatCard(label: 'Active contracts', value: '${d.activeContracts}', accent: VerqoColors.client),
                    StatCard(label: 'Escrow balance', value: Money.formatMinor(d.escrowBalanceMinor), accent: VerqoColors.client),
                    StatCard(label: 'Pending approvals', value: '${d.pendingApprovalsCount}', accent: VerqoColors.client),
                    StatCard(label: 'Open job posts', value: '${d.openJobsCount}', accent: VerqoColors.client),
                  ],
                ),
                if (d.pendingApprovals.isNotEmpty) ...[
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: VerqoColors.surface200,
                      borderRadius: BorderRadius.circular(VerqoRadius.lg),
                      border: const Border(left: BorderSide(color: VerqoColors.client, width: 3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Pending approvals', style: Theme.of(context).textTheme.titleLarge),
                        const Text('Work submitted and waiting for you to release payment.',
                            style: TextStyle(color: VerqoColors.inkSecondary, fontSize: 13)),
                        const SizedBox(height: 8),
                        for (final approval in d.pendingApprovals)
                          _PendingApprovalRow(
                            approval: approval,
                            acting: _acting == approval.id,
                            onApprove: () => _approve(approval.id),
                          ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                Text('Your contractors', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                if (d.contracts.isEmpty)
                  const Text('No active contracts yet — find a contractor or post a project to get started.',
                      style: TextStyle(color: VerqoColors.inkSecondary))
                else
                  ...d.contracts.map((c) => ContractCard(
                        contract: c,
                        accent: VerqoColors.client,
                        acting: _acting,
                        onFund: _fund,
                      )),
                const SizedBox(height: 16),
                Text('Your job posts', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 8),
                if (d.postedJobs.isEmpty)
                  const Text('Nothing posted yet.', style: TextStyle(color: VerqoColors.inkSecondary))
                else
                  ...d.postedJobs.map((j) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(j.title),
                        trailing: Text('${j.proposalCount} proposal${j.proposalCount == 1 ? '' : 's'}',
                            style: const TextStyle(color: VerqoColors.inkSecondary, fontSize: 12)),
                        leading: StatusBadge(label: j.status),
                      )),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: VerqoTheme.clientButton(),
                    onPressed: _createProject,
                    child: const Text('Create new project'),
                  ),
                ),
                const SizedBox(height: 24),
                Text('Find new contractors', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                _FreelancerSearchField(onSearch: (q) => _searchFreelancers(q: q)),
                const SizedBox(height: 8),
                if (_searching)
                  const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Text('Searching…'))
                else if (_freelancers != null && _freelancers!.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Text('No contractors match that search.', style: TextStyle(color: VerqoColors.inkSecondary)),
                  )
                else
                  for (final f in _freelancers ?? const <FreelancerListItem>[]) _FreelancerRow(freelancer: f),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _PendingApprovalRow extends StatelessWidget {
  final PendingApproval approval;
  final bool acting;
  final VoidCallback onApprove;
  const _PendingApprovalRow({required this.approval, required this.acting, required this.onApprove});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(approval.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                    Text(approval.freelancerName, style: const TextStyle(color: VerqoColors.inkSecondary, fontSize: 13)),
                  ],
                ),
              ),
              Text(Money.formatMinor(approval.contractValueMinor), style: const TextStyle(fontFamily: 'monospace')),
            ],
          ),
          if (approval.reviewDeadlineAt != null)
            Text('Review by ${formatShortDate(approval.reviewDeadlineAt)}',
                style: const TextStyle(color: VerqoColors.inkSecondary, fontSize: 12)),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: ElevatedButton(
              style: VerqoTheme.clientButton(),
              onPressed: acting ? null : onApprove,
              child: Text(acting ? 'Releasing…' : 'Approve & release'),
            ),
          ),
          const Divider(height: 20),
        ],
      ),
    );
  }
}

class _FreelancerSearchField extends StatefulWidget {
  final ValueChanged<String> onSearch;
  const _FreelancerSearchField({required this.onSearch});

  @override
  State<_FreelancerSearchField> createState() => _FreelancerSearchFieldState();
}

class _FreelancerSearchFieldState extends State<_FreelancerSearchField> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _controller,
            decoration: const InputDecoration(hintText: 'Search by role or name'),
            onSubmitted: widget.onSearch,
          ),
        ),
        const SizedBox(width: 8),
        OutlinedButton(onPressed: () => widget.onSearch(_controller.text), child: const Text('Search')),
      ],
    );
  }
}

class _FreelancerRow extends StatelessWidget {
  final FreelancerListItem freelancer;
  const _FreelancerRow({required this.freelancer});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(freelancer.displayName, style: const TextStyle(fontWeight: FontWeight.w600)),
                    if (freelancer.isFullyVerified) ...[
                      const SizedBox(width: 8),
                      const VerifiedPill(verified: true),
                    ],
                  ],
                ),
                Text('${freelancer.primaryRole} · ${freelancer.experienceLevel}',
                    style: const TextStyle(color: VerqoColors.inkSecondary, fontSize: 13)),
              ],
            ),
          ),
          if (freelancer.hourlyRateMinor != null)
            Text('${Money.formatMinor(freelancer.hourlyRateMinor!)}/hr', style: const TextStyle(fontFamily: 'monospace')),
        ],
      ),
    );
  }
}

class _ProjectDraft {
  final String title;
  final String description;
  final String roleCategory;
  final int? budgetMinorMin;
  final int? budgetMinorMax;
  _ProjectDraft({
    required this.title,
    required this.description,
    required this.roleCategory,
    this.budgetMinorMin,
    this.budgetMinorMax,
  });
}

class _CreateProjectSheet extends StatefulWidget {
  const _CreateProjectSheet();

  @override
  State<_CreateProjectSheet> createState() => _CreateProjectSheetState();
}

class _CreateProjectSheetState extends State<_CreateProjectSheet> {
  final _formKey = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _description = TextEditingController();
  final _roleCategory = TextEditingController();
  final _budgetMin = TextEditingController();
  final _budgetMax = TextEditingController();

  @override
  void dispose() {
    _title.dispose();
    _description.dispose();
    _roleCategory.dispose();
    _budgetMin.dispose();
    _budgetMax.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final min = double.tryParse(_budgetMin.text);
    final max = double.tryParse(_budgetMax.text);
    Navigator.of(context).pop(_ProjectDraft(
      title: _title.text.trim(),
      description: _description.text.trim(),
      roleCategory: _roleCategory.text.trim(),
      budgetMinorMin: min != null ? (min * 100).round() : null,
      budgetMinorMax: max != null ? (max * 100).round() : null,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Create new project', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            TextFormField(
              controller: _title,
              decoration: const InputDecoration(labelText: 'Project title'),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required.' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _description,
              decoration: const InputDecoration(labelText: 'What needs doing'),
              maxLines: 3,
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required.' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _roleCategory,
              decoration: const InputDecoration(labelText: 'Role', hintText: 'e.g. Backend Engineer'),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required.' : null,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _budgetMin,
                    decoration: const InputDecoration(labelText: 'Budget from (₹)'),
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _budgetMax,
                    decoration: const InputDecoration(labelText: 'Budget to (₹)'),
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: VerqoTheme.clientButton(),
                onPressed: _submit,
                child: const Text('Post project'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
