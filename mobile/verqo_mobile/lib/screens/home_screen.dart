import 'package:flutter/material.dart';
import '../theme/verqo_theme.dart';
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
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: VerqoColors.silver,
                      letterSpacing: 1.1,
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 12),
              Text('Verified tech talent.\nEscrow-protected pay.',
                  style: Theme.of(context).textTheme.headlineLarge),
              const SizedBox(height: 16),
              Text(
                "Verqo connects Indian tech freelancers with businesses, hourly or by "
                "project — with milestone escrow so every rupee is protected until the "
                "work is done.",
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.black54, height: 1.5),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const FreelancerSignupScreen()),
                ),
                child: const Text('Join as a freelancer'),
              ),
              const SizedBox(height: 32),
              _FeeCard(),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeeCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: VerqoColors.black,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Simple fees', style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white)),
          const SizedBox(height: 8),
          const Text(
            'Freelancers pay a fixed 5%, only when paid. No registration or subscription fee, ever.',
            style: TextStyle(color: VerqoColors.silverLight, height: 1.5),
          ),
        ],
      ),
    );
  }
}
