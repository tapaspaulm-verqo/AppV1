import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../theme/verqo_theme.dart';
import '../utils/money.dart';

/// Open-role browsing — GET /api/v1/jobs (JobsController). Read-only for
/// now: proposals/contracts aren't wired up yet on any client (see
/// docs/ARCHITECTURE.md §10, item 5).
class JobsScreen extends StatefulWidget {
  const JobsScreen({super.key});

  @override
  State<JobsScreen> createState() => _JobsScreenState();
}

class _JobsScreenState extends State<JobsScreen> {
  final _api = ApiClient();
  late Future<List<JobSummary>> _jobsFuture;

  @override
  void initState() {
    super.initState();
    _jobsFuture = _api.listOpenJobs();
  }

  Future<void> _refresh() async {
    final next = _api.listOpenJobs();
    setState(() => _jobsFuture = next);
    await next;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Find work')),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: FutureBuilder<List<JobSummary>>(
          future: _jobsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return _EmptyState(
                icon: Icons.wifi_off_rounded,
                message: "Couldn't load open roles — pull down to try again.",
              );
            }
            final jobs = snapshot.data ?? const [];
            if (jobs.isEmpty) {
              return const _EmptyState(
                icon: Icons.search_off_rounded,
                message: 'No open roles right now — check back soon.',
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: jobs.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, i) => _JobCard(job: jobs[i]),
            );
          },
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String message;
  const _EmptyState({required this.icon, required this.message});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        const SizedBox(height: 120),
        Icon(icon, size: 40, color: VerqoColors.silver),
        const SizedBox(height: 12),
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(message, textAlign: TextAlign.center, style: const TextStyle(color: VerqoColors.inkSecondary)),
          ),
        ),
      ],
    );
  }
}

class _JobCard extends StatelessWidget {
  final JobSummary job;
  const _JobCard({required this.job});

  String get _budgetLabel {
    final min = job.budgetMinorMin;
    final max = job.budgetMinorMax;
    if (min == null && max == null) return 'Budget not specified';
    if (min != null && max != null) return '${Money.formatMinor(min)} – ${Money.formatMinor(max)}';
    return Money.formatMinor((min ?? max)!);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: VerqoColors.surface200,
        borderRadius: BorderRadius.circular(VerqoRadius.lg),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(job.title, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: [
              _Tag(label: job.roleCategory),
              _Tag(label: job.channel),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            _budgetLabel,
            style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w600, color: VerqoColors.ink),
          ),
        ],
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  final String label;
  const _Tag({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: VerqoColors.surface100,
        border: Border.all(color: VerqoColors.borderSubtle),
        borderRadius: BorderRadius.circular(VerqoRadius.full),
      ),
      child: Text(label, style: const TextStyle(fontSize: 12, color: VerqoColors.inkSecondary)),
    );
  }
}
