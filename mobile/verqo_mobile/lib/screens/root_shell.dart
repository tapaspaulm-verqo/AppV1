import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'dashboard/dashboard_screen.dart';
import 'home_screen.dart';
import 'jobs_screen.dart';
import 'login_screen.dart';

/// App shell with a bottom nav bar — Home, Find work, and an auth-aware
/// third tab that mirrors the web app's header (`HeaderComponent`): a
/// "Log in" destination when signed out, and "Dashboard" (the freelancer's
/// or client's personalised view, with a way to log out) once signed in.
/// Rebuilds whenever AuthService changes so logging in/out immediately
/// updates the tab's icon, label and content without navigating away.
class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _index = 0;

  @override
  void initState() {
    super.initState();
    AuthService.instance.restoreSession();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AuthService.instance,
      builder: (context, _) {
        final loggedIn = AuthService.instance.isLoggedIn;
        final screens = [
          const HomeScreen(),
          const JobsScreen(),
          loggedIn ? const DashboardScreen() : const LoginScreen(),
        ];

        return Scaffold(
          body: IndexedStack(index: _index, children: screens),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _index,
            onTap: (i) => setState(() => _index = i),
            items: [
              const BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
              const BottomNavigationBarItem(icon: Icon(Icons.work_outline), activeIcon: Icon(Icons.work), label: 'Find work'),
              BottomNavigationBarItem(
                icon: Icon(loggedIn ? Icons.dashboard_outlined : Icons.login),
                activeIcon: Icon(loggedIn ? Icons.dashboard : Icons.login),
                label: loggedIn ? 'Dashboard' : 'Log in',
              ),
            ],
          ),
        );
      },
    );
  }
}
