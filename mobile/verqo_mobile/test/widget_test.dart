import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:verqo_mobile/main.dart';

void main() {
  // VerqoTheme.light() loads IBM Plex Sans/Inter via google_fonts, which by
  // default tries to fetch font files over the network at runtime. Test
  // runs shouldn't depend on that succeeding (or hang waiting on it) — this
  // is the package's own documented fix: fall back to the bundled default
  // instead of fetching, so widget tests are fast and hermetic.
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('Home tab renders the hero copy and both signup CTAs', (tester) async {
    await tester.pumpWidget(const VerqoApp());
    await tester.pumpAndSettle();

    expect(find.textContaining('Verified tech talent'), findsOneWidget);
    expect(find.widgetWithText(ElevatedButton, 'Join as a freelancer'), findsOneWidget);
    expect(find.widgetWithText(OutlinedButton, 'Hire talent'), findsOneWidget);
  });

  testWidgets('Bottom nav switches to the Find work tab', (tester) async {
    await tester.pumpWidget(const VerqoApp());
    await tester.pumpAndSettle();

    // Tap the nav icon rather than find.text('Find work') — IndexedStack
    // keeps the inactive Jobs tab (whose AppBar title is also "Find work")
    // mounted in the tree, so a text-based finder would match twice.
    await tester.tap(find.byIcon(Icons.work_outline));
    await tester.pumpAndSettle();

    expect(find.widgetWithText(AppBar, 'Find work'), findsOneWidget);
  });

  testWidgets('Join as a freelancer opens the freelancer signup form', (tester) async {
    await tester.pumpWidget(const VerqoApp());
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Join as a freelancer'));
    await tester.pumpAndSettle();

    expect(find.widgetWithText(AppBar, 'Join as a freelancer'), findsOneWidget);
    expect(find.text('PAN number'), findsOneWidget);
    expect(find.text('Aadhaar number'), findsOneWidget);
  });

  testWidgets('Hire talent opens the client signup form', (tester) async {
    await tester.pumpWidget(const VerqoApp());
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(OutlinedButton, 'Hire talent'));
    await tester.pumpAndSettle();

    expect(find.text('Company name'), findsOneWidget);
    expect(find.textContaining('GSTIN'), findsWidgets);
  });
}
