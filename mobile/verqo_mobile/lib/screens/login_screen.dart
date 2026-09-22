import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../services/auth_service.dart';

/// Login for both personas — same single form as the web app's
/// LoginComponent, since AuthController's /auth/login endpoint doesn't
/// distinguish Freelancer vs Client until after it checks the password.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiClient();

  final _email = TextEditingController();
  final _password = TextEditingController();

  bool _submitting = false;
  String? _errorMessage;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _errorMessage = null;
    });

    try {
      final response = await _api.login(email: _email.text.trim(), password: _password.text);
      await AuthService.instance.setSession(response);
    } on ApiException catch (_) {
      setState(() => _errorMessage = 'Invalid email or password.');
    } catch (_) {
      setState(() => _errorMessage = "Couldn't reach Verqo — check your connection and try again.");
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Log in')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Welcome back', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 8),
                const Text('Freelancer or Client — one login for both, taken straight to your dashboard.'),
                const SizedBox(height: 24),
                TextFormField(
                  controller: _email,
                  decoration: const InputDecoration(labelText: 'Email'),
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) => (v == null || !v.contains('@')) ? 'A valid email is required.' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _password,
                  decoration: const InputDecoration(labelText: 'Password'),
                  obscureText: true,
                  validator: (v) => (v == null || v.isEmpty) ? 'Required.' : null,
                  onFieldSubmitted: (_) => _submitting ? null : _submit(),
                ),
                if (_errorMessage != null) ...[
                  const SizedBox(height: 16),
                  Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
                ],
                const SizedBox(height: 28),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _submitting ? null : _submit,
                    child: Text(_submitting ? 'Logging in…' : 'Log in'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
