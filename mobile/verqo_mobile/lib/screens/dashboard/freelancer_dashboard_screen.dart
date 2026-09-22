import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../theme/verqo_theme.dart';
import '../../utils/money.dart';
import 'dashboard_widgets.dart';

/// Freelancer's personalised post-login view — GET /api/v1/dashboard/freelancer
/// (DashboardController.Freelancer). Contracts, cost, payment milestones,
/// project delivery milestones, taxes and new-project search all live here,
/// same data/shape as the web app's FreelancerDashboardComponent.
class FreelancerDashboardScreen extends StatefulWidget {
  const FreelancerDashboardScreen({super.key});

  @override
  State<FreelancerDashboardScreen> createState() => _FreelancerDashboardScreenState();
}

class _FreelancerDashboardScreenState extends State<FreelancerDashboardScreen> {
  final _api = ApiClient();
  late Future<FreelancerDashboard> _future;

  /// Milestone id currently mid-action (Start/Submit), so its button can
  /// show a spinner and every other button stays enabled.
  String? _acting;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<FreelancerDashboard> _load() {
    final token = AuthService.instance.token;
    if (token == null) return Future.error(ApiException(401, 'No session'));
    return _api.getFreelancerDashboard(token);
  }

  Future<void> _refresh() async {
    final next = _load();
    setState(() => _future = next);
    await next;
  }

  Future<void> _act(String milestoneId, Future<void> Function(String token, String id) action) async {
    final token = AuthService.instance.token;
    if (token == null) return;
    setState(() => _acting = milestoneId);
    try {
      await action(token, milestoneId);
      await _refresh();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Couldn't update that milestone — try again.")),
        );
      }
    } finally {
      if (mounted) setState(() => _acting = null);
    }
  }

  Future<void> _apply(RecommendedJob job) async {
    final result = await showModalBottomSheet<_ProposalDraft>(
      context: context,
      isScrollControlled: true,
      builder: (_) => _ApplySheet(job: job),
    );
    if (result == null) return;

    final token = AuthService.instance.token;
    if (token == null) return;
    try {
      await _api.submitProposal(
        token,
        jobId: job.id,
        coverNote: result.coverNote,
        proposedRateMinor: result.proposedRateMinor,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Proposal sent.')));
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Couldn't send that proposal — you may have already applied.")),
        );
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
        child: FutureBuilder<FreelancerDashboard>(
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
                Text('Welcome back, ${d.displayName}', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 4),
                Text('${d.primaryRole} · ${d.experienceLevel}',
                    style: const TextStyle(color: VerqoColors.inkSecondary)),
                const SizedBox(height: 4),
                VerifiedPill(verified: d.isFullyVerified),
                const SizedBox(height: 20),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.6,
                  children: [
                    StatCard(label: 'Active contracts', value: '${d.activeContracts}', accent: VerqoColors.accent),
                    StatCard(label: 'Total earned', value: Money.formatMinor(d.totalEarnedMinor), accent: VerqoColors.accent),
                    StatCard(
                        label: 'Pending in escrow', value: Money.formatMinor(d.pendingInEscrowMinor), accent: VerqoColors.accent),
                    StatCard(label: 'Open proposals', value: '${d.openProposalsCount}', accent: VerqoColors.accent),
                  ],
                ),
                const SizedBox(height: 24),
                Text('Your contracts', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                if (d.contracts.isEmpty)
                  const Text('No contracts yet — apply to an open job to get started.',
                      style: TextStyle(color: VerqoColors.inkSecondary))
                else
                  ...d.contracts.map((c) => ContractCard(
                        contract: c,
                        accent: VerqoColors.accent,
                        acting: _acting,
                        onStart: (id) => _act(id, (t, i) => _api.startMilestone(t, i)),
                        onSubmit: (id) => _act(id, (t, i) => _api.submitMilestone(t, i)),
                      )),
                const SizedBox(height: 24),
                _TaxCard(taxSummary: d.taxSummary),
                const SizedBox(height: 16),
                Text('New project search', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                if (d.recommendedJobs.isEmpty)
                  const Text('No open jobs matching your role right now.',
                      style: TextStyle(color: VerqoColors.inkSecondary))
                else
                  ...d.recommendedJobs.map((job) => _RecommendedJobCard(job: job, onApply: () => _apply(job))),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _TaxCard extends StatelessWidget {
  final FreelancerTaxSummary taxSummary;
  const _TaxCard({required this.taxSummary});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: VerqoColors.surface200, borderRadius: BorderRadius.circular(VerqoRadius.lg)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Earnings & taxes', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          _TaxRow('FY-to-date earned', Money.formatMinor(taxSummary.fyToDateEarnedMinor)),
          _TaxRow('Estimated TDS (Sec. 194-O)', Money.formatMinor(taxSummary.estimatedTdsMinor)),
          _TaxRow('GST collected on file', Money.formatMinor(taxSummary.totalGstCollectedMinor)),
          const SizedBox(height: 12),
          Text(taxSummary.note, style: const TextStyle(fontSize: 12, color: VerqoColors.inkSecondary, height: 1.4)),
        ],
      ),
    );
  }
}

class _TaxRow extends StatelessWidget {
  final String label;
  final String value;
  const _TaxRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(label, style: const TextStyle(color: VerqoColors.inkSecondary, fontSize: 13))),
          Text(value, style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _RecommendedJobCard extends StatelessWidget {
  final RecommendedJob job;
  final VoidCallback onApply;
  const _RecommendedJobCard({required this.job, required this.onApply});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: VerqoColors.surface100,
        border: Border.all(color: VerqoColors.borderSubtle),
        borderRadius: BorderRadius.circular(VerqoRadius.lg),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(job.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                Text('${job.clientName} · ${job.roleCategory}',
                    style: const TextStyle(color: VerqoColors.inkSecondary, fontSize: 13)),
              ],
            ),
          ),
          OutlinedButton(onPressed: onApply, child: const Text('Apply')),
        ],
      ),
    );
  }
}

class _ProposalDraft {
  final String coverNote;
  final int proposedRateMinor;
  _ProposalDraft(this.coverNote, this.proposedRateMinor);
}

class _ApplySheet extends StatefulWidget {
  final RecommendedJob job;
  const _ApplySheet({required this.job});

  @override
  State<_ApplySheet> createState() => _ApplySheetState();
}

class _ApplySheetState extends State<_ApplySheet> {
  final _coverNote = TextEditingController();
  final _rate = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _coverNote.dispose();
    _rate.dispose();
    super.dispose();
  }

  void _send() {
    final rate = double.tryParse(_rate.text);
    if (_coverNote.text.trim().isEmpty || rate == null || rate <= 0) {
      setState(() => _error = 'Add a cover note and a proposed rate first.');
      return;
    }
    Navigator.of(context).pop(_ProposalDraft(_coverNote.text.trim(), (rate * 100).round()));
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
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Apply to ${widget.job.title}', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 16),
          TextField(
            controller: _coverNote,
            decoration: const InputDecoration(labelText: "Why you're a good fit"),
            maxLines: 3,
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _rate,
            decoration: const InputDecoration(labelText: 'Proposed rate (₹)'),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          if (_error != null) ...[
            const SizedBox(height: 8),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(onPressed: _send, child: const Text('Send proposal')),
          ),
        ],
      ),
    );
  }
}
