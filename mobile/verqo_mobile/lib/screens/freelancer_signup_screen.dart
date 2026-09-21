import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../validators/kyc_validators.dart';

class FreelancerSignupScreen extends StatefulWidget {
  const FreelancerSignupScreen({super.key});

  @override
  State<FreelancerSignupScreen> createState() => _FreelancerSignupScreenState();
}

class _FreelancerSignupScreenState extends State<FreelancerSignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiClient();

  final _email = TextEditingController();
  final _password = TextEditingController();
  final _displayName = TextEditingController();
  final _primaryRole = TextEditingController();
  final _pan = TextEditingController();
  final _aadhaar = TextEditingController();
  final _epfUan = TextEditingController();

  bool _submitting = false;
  String? _errorMessage;
  RegisterFreelancerResponse? _result;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _errorMessage = null;
    });

    try {
      final result = await _api.registerFreelancer(
        email: _email.text.trim(),
        password: _password.text,
        displayName: _displayName.text.trim(),
        primaryRole: _primaryRole.text.trim(),
        panNumber: PanValidator.normalize(_pan.text),
        aadhaarNumber: _aadhaar.text.replaceAll(' ', '').trim(),
        epfUan: _epfUan.text.trim().isEmpty ? null : _epfUan.text.trim(),
      );
      setState(() => _result = result);
    } catch (e) {
      setState(() => _errorMessage = 'Something went wrong verifying your details — please check them and try again.');
    } finally {
      setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final result = _result;
    return Scaffold(
      appBar: AppBar(title: const Text('Join as a freelancer')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: result != null ? _buildResult(result) : _buildForm(),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Free to join — a fixed 5% fee only when you're paid. We validate your PAN "
            'and Aadhaar automatically, and check your EPF account status if you give us your UAN.',
          ),
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
            validator: (v) => (v == null || v.length < 8) ? 'At least 8 characters.' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _displayName,
            decoration: const InputDecoration(labelText: 'Full name'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Required.' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _primaryRole,
            decoration: const InputDecoration(labelText: 'Primary role', hintText: 'e.g. Backend Engineer'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Required.' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _pan,
            decoration: const InputDecoration(labelText: 'PAN number', hintText: 'AAAAA9999A'),
            textCapitalization: TextCapitalization.characters,
            validator: (v) => PanValidator.validate(v).isValid ? null : PanValidator.validate(v).reason,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _aadhaar,
            decoration: const InputDecoration(labelText: 'Aadhaar number', hintText: '12 digits'),
            keyboardType: TextInputType.number,
            validator: (v) => AadhaarValidator.validate(v).isValid ? null : AadhaarValidator.validate(v).reason,
          ),
          const SizedBox(height: 4),
          const Text(
            'Only the last 4 digits are ever stored — see docs/ARCHITECTURE.md for why.',
            style: TextStyle(fontSize: 12, color: Colors.black54),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _epfUan,
            decoration: const InputDecoration(
              labelText: 'EPF UAN (optional)',
              hintText: '12 digits — enables the active-account check',
            ),
            keyboardType: TextInputType.number,
          ),
          if (_errorMessage != null) ...[
            const SizedBox(height: 16),
            Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 28),
          ElevatedButton(
            onPressed: _submitting ? null : _submit,
            child: Text(_submitting ? 'Verifying…' : 'Create freelancer account'),
          ),
        ],
      ),
    );
  }

  Widget _buildResult(RegisterFreelancerResponse result) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("You're in", style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: 8),
        const Text("Here's where your verification stands right now:"),
        const SizedBox(height: 16),
        Text('PAN: ${result.panStatus}'),
        Text('Aadhaar: ${result.aadhaarStatus}'),
        Text('EPF active status: ${result.epfStatus}'),
        if (!result.isFullyVerified) ...[
          const SizedBox(height: 16),
          const Text(
            'Some checks still need review — this is expected for the EPF check today '
            "(EPFO has no public API; a Verqo team member confirms it manually).",
            style: TextStyle(color: Colors.red),
          ),
        ],
      ],
    );
  }
}
