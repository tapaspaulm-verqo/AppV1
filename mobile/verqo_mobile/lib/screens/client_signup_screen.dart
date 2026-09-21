import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../theme/verqo_theme.dart';
import '../validators/kyc_validators.dart';

/// Client registration, wired to POST /api/v1/clients/register — the
/// mobile mirror of the Angular app's `ClientSignupComponent`. Deliberately
/// lighter than freelancer signup: a Client only needs a company name and
/// an optional GSTIN. Every self-serve signup starts on the Standard plan;
/// Business Plus is volume-negotiated (draft Client Agreement Clause 4.3),
/// so it isn't offered as a form field here.
class ClientSignupScreen extends StatefulWidget {
  const ClientSignupScreen({super.key});

  @override
  State<ClientSignupScreen> createState() => _ClientSignupScreenState();
}

class _ClientSignupScreenState extends State<ClientSignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiClient();

  final _email = TextEditingController();
  final _password = TextEditingController();
  final _companyName = TextEditingController();
  final _gstin = TextEditingController();

  bool _submitting = false;
  String? _errorMessage;
  RegisterClientResponse? _result;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _errorMessage = null;
    });

    try {
      final result = await _api.registerClient(
        email: _email.text.trim(),
        password: _password.text,
        companyName: _companyName.text.trim(),
        gstin: _gstin.text.trim().isEmpty ? null : GstinValidator.normalize(_gstin.text),
      );
      setState(() => _result = result);
    } on ApiException catch (e) {
      setState(() => _errorMessage = friendlyApiErrorMessage(e));
    } catch (_) {
      setState(() => _errorMessage = "Couldn't reach Verqo — check your connection and try again.");
    } finally {
      setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final result = _result;
    return Scaffold(
      appBar: AppBar(title: const Text('Hire verified tech talent')),
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
          Text(
            'FOR BUSINESSES',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(color: VerqoColors.client, letterSpacing: 1.1),
          ),
          const SizedBox(height: 12),
          const Text(
            "Free to register — a 10% Client Fee on the Standard plan, added to what you fund, "
            'with no registration or subscription fee. Need Business Plus (volume pricing down to '
            '5%, dedicated support)? Talk to us about Enterprise.',
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
            controller: _companyName,
            decoration: const InputDecoration(
              labelText: 'Company name',
              hintText: 'e.g. Example Technologies Pvt Ltd',
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Required.' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _gstin,
            decoration: const InputDecoration(
              labelText: 'GSTIN (optional)',
              hintText: '22AAAAA0000A1Z5',
              helperText: 'You can add this later, before funding a milestone.',
            ),
            textCapitalization: TextCapitalization.characters,
            maxLength: 17,
            validator: (v) => GstinValidator.validate(v).isValid ? null : GstinValidator.validate(v).reason,
          ),
          if (_errorMessage != null) ...[
            const SizedBox(height: 8),
            Text(_errorMessage!, style: const TextStyle(color: VerqoColors.danger)),
          ],
          const SizedBox(height: 24),
          ElevatedButton(
            style: VerqoTheme.clientButton(),
            onPressed: _submitting ? null : _submit,
            child: Text(_submitting ? 'Creating account…' : 'Create client account'),
          ),
          const SizedBox(height: 16),
          const Text(
            "By creating an account, you agree to Verqo's Terms of Use, Privacy Policy and Client Agreement.",
            style: TextStyle(fontSize: 12, color: VerqoColors.silver),
          ),
        ],
      ),
    );
  }

  Widget _buildResult(RegisterClientResponse result) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("You're in", style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: 8),
        Text('${result.companyName} is registered on the Standard plan.'),
        const SizedBox(height: 20),
        _StatusRow(label: 'Plan', value: result.plan),
        _StatusRow(label: 'GSTIN', value: result.gstin ?? 'Not provided yet'),
        const SizedBox(height: 20),
        const Text(
          'Next: post a role, or read how escrow and Milestones work before you do.',
          style: TextStyle(color: VerqoColors.inkSecondary),
        ),
      ],
    );
  }
}

class _StatusRow extends StatelessWidget {
  final String label;
  final String value;
  const _StatusRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              // A fixed pale tint of VerqoColors.accent rather than a
              // runtime .withOpacity()/.withValues() call — both APIs have
              // moved under Flutter over the last few releases, and this
              // couldn't be checked against a real SDK here (see
              // mobile/verqo_mobile/README.md), so a plain literal color
              // sidesteps the question entirely.
              color: const Color(0xFFE3EEE8),
              borderRadius: BorderRadius.circular(VerqoRadius.full),
            ),
            child: Text(value, style: const TextStyle(color: VerqoColors.accent, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }
}
