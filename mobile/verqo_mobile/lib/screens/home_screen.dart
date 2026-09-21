import 'package:flutter/material.dart';
import '../theme/verqo_theme.dart';
import 'client_signup_screen.dart';
import 'freelancer_signup_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'INDIA · TECH FREELANCE MARKETPLACE',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(letterSpacing: 1.1),
              ),
              const SizedBox(height: 12),
              Text('Verified tech talent.\nEscrow-protected pay.', style: Theme.of(context).textTheme.headlineLarge),
              const SizedBox(height: 16),
              const Text(
                'Verqo connects Indian tech freelancers with businesses, hourly or by '
                'project — with milestone escrow so every rupee is protected until the '
                'work is done.',
                style: TextStyle(color: VerqoColors.inkSecondary, height: 1.5, fontSize: 15),
              ),
              const SizedBox(height: 28),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const FreelancerSignupScreen()),
                      ),
                      child: const Text('Join as a freelancer'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const ClientSignupScreen()),
                      ),
                      child: const Text('Hire talent'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const _FeeCard(
                accent: VerqoColors.accent,
                title: 'For freelancers',
                body: 'A fixed 5% fee, only when you’re paid. No registration or subscription fee, ever.',
              ),
              const SizedBox(height: 16),
              const _FeeCard(
                accent: VerqoColors.client,
                title: 'For businesses',
                body: 'A 10% Client Fee on the Standard plan, added to what you fund. Business Plus brings '
                    'that down to 5% at volume.',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeeCard extends StatelessWidget {
  final Color accent;
  final String title;
  final String body;

  const _FeeCard({required this.accent, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: VerqoColors.ink,
        borderRadius: BorderRadius.circular(VerqoRadius.lg),
        border: Border(left: BorderSide(color: accent, width: 4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white)),
          const SizedBox(height: 8),
          Text(body, style: const TextStyle(color: VerqoColors.silver, height: 1.5)),
        ],
      ),
    );
  }
}
