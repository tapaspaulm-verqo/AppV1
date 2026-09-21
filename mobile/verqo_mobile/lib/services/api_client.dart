import 'dart:convert';
import 'package:http/http.dart' as http;

/// Thin wrapper over the same .NET Web API the Angular web app calls. One
/// backend, three clients — see docs/ARCHITECTURE.md.
class ApiClient {
  // Android emulator reaches the host machine at 10.0.2.2; iOS simulator
  // uses localhost directly. Swap for the real API URL (behind the
  // Kubernetes Ingress) via --dart-define=API_BASE_URL=... at build time.
  static const _baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8080/api/v1',
  );

  final http.Client _http;
  ApiClient({http.Client? client}) : _http = client ?? http.Client();

  Future<RegisterFreelancerResponse> registerFreelancer({
    required String email,
    required String password,
    required String displayName,
    required String primaryRole,
    required String panNumber,
    required String aadhaarNumber,
    String? epfUan,
  }) async {
    final response = await _http.post(
      Uri.parse('$_baseUrl/freelancers/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'displayName': displayName,
        'primaryRole': primaryRole,
        'panNumber': panNumber,
        'aadhaarNumber': aadhaarNumber,
        if (epfUan != null && epfUan.isNotEmpty) 'epfUan': epfUan,
      }),
    );

    if (response.statusCode == 201) {
      return RegisterFreelancerResponse.fromJson(jsonDecode(response.body));
    }
    throw ApiException(response.statusCode, response.body);
  }

  Future<List<JobSummary>> listOpenJobs() async {
    final response = await _http.get(Uri.parse('$_baseUrl/jobs'));
    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }
    final list = jsonDecode(response.body) as List<dynamic>;
    return list.map((j) => JobSummary.fromJson(j as Map<String, dynamic>)).toList();
  }

  Future<RegisterClientResponse> registerClient({
    required String email,
    required String password,
    required String companyName,
    String? gstin,
  }) async {
    final response = await _http.post(
      Uri.parse('$_baseUrl/clients/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'companyName': companyName,
        if (gstin != null && gstin.isNotEmpty) 'gstin': gstin,
      }),
    );

    if (response.statusCode == 201) {
      return RegisterClientResponse.fromJson(jsonDecode(response.body));
    }
    throw ApiException(response.statusCode, response.body);
  }
}

/// Both `FreelancersController` and `ClientsController` return a
/// validation failure as `BadRequest(new ValidationProblemDetails(errors))`
/// — a JSON body shaped `{ "errors": { "field": ["message", ...], ... } }`.
/// This flattens that into one readable string for display, the same way
/// the Angular app's `err.error.errors` handling does. Falls back to a
/// generic message for anything not in that shape (a 500, a network-level
/// failure, an unexpected body).
String friendlyApiErrorMessage(
  ApiException error, {
  String fallback = 'Something went wrong — please check your details and try again.',
}) {
  try {
    final decoded = jsonDecode(error.body);
    if (decoded is Map<String, dynamic> && decoded['errors'] is Map) {
      final errors = decoded['errors'] as Map;
      final messages = <String>[
        for (final value in errors.values)
          if (value is List) ...value.map((m) => m.toString()),
      ];
      if (messages.isNotEmpty) return messages.join(' ');
    }
  } catch (_) {
    // Body wasn't the expected JSON shape — fall through to the fallback.
  }
  return fallback;
}

class ApiException implements Exception {
  final int statusCode;
  final String body;
  ApiException(this.statusCode, this.body);
  @override
  String toString() => 'ApiException($statusCode): $body';
}

class RegisterFreelancerResponse {
  final String userId;
  final String panStatus;
  final String aadhaarStatus;
  final String epfStatus;
  final bool isFullyVerified;

  RegisterFreelancerResponse({
    required this.userId,
    required this.panStatus,
    required this.aadhaarStatus,
    required this.epfStatus,
    required this.isFullyVerified,
  });

  factory RegisterFreelancerResponse.fromJson(Map<String, dynamic> json) {
    final profile = json['profile'] as Map<String, dynamic>;
    return RegisterFreelancerResponse(
      userId: json['userId'] as String,
      panStatus: profile['panStatus'] as String,
      aadhaarStatus: profile['aadhaarStatus'] as String,
      epfStatus: profile['epfStatus'] as String,
      isFullyVerified: profile['isFullyVerified'] as bool,
    );
  }
}

class JobSummary {
  final String id;
  final String title;
  final String roleCategory;

  /// "B2B" or "B2C" — see Verqo.Domain.Enums.EngagementChannel. Not a
  /// pricing model (that's per-Milestone), just who the Client is.
  final String channel;

  /// Minor units (paise). Either or both may be null — a Job can be posted
  /// without a budget range.
  final int? budgetMinorMin;
  final int? budgetMinorMax;

  JobSummary({
    required this.id,
    required this.title,
    required this.roleCategory,
    required this.channel,
    this.budgetMinorMin,
    this.budgetMinorMax,
  });

  factory JobSummary.fromJson(Map<String, dynamic> json) => JobSummary(
        id: json['id'] as String,
        title: json['title'] as String,
        roleCategory: json['roleCategory'] as String,
        channel: json['channel'] as String,
        budgetMinorMin: json['budgetMinorMin'] as int?,
        budgetMinorMax: json['budgetMinorMax'] as int?,
      );
}

class RegisterClientResponse {
  final String userId;
  final String companyName;
  final String? gstin;
  final String plan;

  RegisterClientResponse({
    required this.userId,
    required this.companyName,
    this.gstin,
    required this.plan,
  });

  factory RegisterClientResponse.fromJson(Map<String, dynamic> json) {
    final profile = json['profile'] as Map<String, dynamic>;
    return RegisterClientResponse(
      userId: json['userId'] as String,
      companyName: profile['companyName'] as String,
      gstin: profile['gstin'] as String?,
      plan: profile['plan'] as String,
    );
  }
}
