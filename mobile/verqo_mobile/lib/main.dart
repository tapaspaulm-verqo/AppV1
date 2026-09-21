import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'theme/verqo_theme.dart';

void main() {
  runApp(const VerqoApp());
}

class VerqoApp extends StatelessWidget {
  const VerqoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Verqo',
      debugShowCheckedModeBanner: false,
      theme: VerqoTheme.light(),
      home: const HomeScreen(),
    );
  }
}
