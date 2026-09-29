import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'models/user_role.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Supabase initialization with public anon key only (Edge functions handle privileged work)
  runApp(const CollegeHelpdeskApp());
}

class CollegeHelpdeskApp extends StatelessWidget {
  const CollegeHelpdeskApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'College Helpdesk System',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const MainPortalScreen(),
    );
  }
}

class MainPortalScreen extends StatelessWidget {
  const MainPortalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('K.M. University • Student Support Portal'),
      ),
      body: Center(
        child: Text(
          'Phase 1 Architecture Initialized: Multi-Tenant Flutter Core',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
      ),
    );
  }
}
