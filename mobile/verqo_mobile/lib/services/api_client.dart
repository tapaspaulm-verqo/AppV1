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
  final String channel;

  JobSummary({required this.id, required this.title, required this.roleCategory, required this.channel});

  factory JobSummary.fromJson(Map<String, dynamic> json) => JobSummary(
        id: json['id'] as String,
        title: json['title'] as String,
        roleCategory: json['roleCategory'] as String,
        channel: json['channel'] as String,
      );
}
