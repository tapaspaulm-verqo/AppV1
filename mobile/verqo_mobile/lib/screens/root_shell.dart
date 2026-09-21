import 'package:flutter/material.dart';
import 'home_screen.dart';
import 'jobs_screen.dart';

/// App shell with a bottom nav bar — Home and Find work. Signup (freelancer
/// or client) is reached from Home's two CTAs rather than being its own
/// tab, mirroring how the web app treats signup as a destination you're
/// sent to, not a persistent nav item.
class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _index = 0;

  static const _screens = [HomeScreen(), JobsScreen()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.work_outline), activeIcon: Icon(Icons.work), label: 'Find work'),
        ],
      ),
    );
  }
}
