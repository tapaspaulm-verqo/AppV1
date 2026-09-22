import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import 'client_dashboard_screen.dart';
import 'freelancer_dashboard_screen.dart';

/// Routes a logged-in session to the right persona's dashboard — same role
/// check as the web app's DashboardComponent. A Freelancer and a Client see
/// almost entirely different data (their own earnings/taxes/proposals vs.
/// their escrow balance/approval queue/contractors), which is why this is a
/// switch between two whole screens rather than one shared layout.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final role = AuthService.instance.user?.role;
    if (role == 'Client') return const ClientDashboardScreen();
    if (role == 'Freelancer') return const FreelancerDashboardScreen();
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: const Center(child: Text('This account has no Freelancer or Client profile to show a dashboard for.')),
    );
  }
}
