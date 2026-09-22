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

  Map<String, String> _authHeaders(String token) => {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };

  // ---------------------------------------------------------------------
  // Auth — AuthController
  // ---------------------------------------------------------------------

  Future<LoginResponse> login({required String email, required String password}) async {
    final response = await _http.post(
      Uri.parse('$_baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }
    return LoginResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  // ---------------------------------------------------------------------
  // Dashboard — DashboardController. One call per persona, same shape the
  // Angular web app's ApiService reads — see backend/.../DashboardController.cs.
  // ---------------------------------------------------------------------

  Future<FreelancerDashboard> getFreelancerDashboard(String token) async {
    final response = await _http.get(Uri.parse('$_baseUrl/dashboard/freelancer'), headers: _authHeaders(token));
    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }
    return FreelancerDashboard.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<ClientDashboard> getClientDashboard(String token) async {
    final response = await _http.get(Uri.parse('$_baseUrl/dashboard/client'), headers: _authHeaders(token));
    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }
    return ClientDashboard.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  // ---------------------------------------------------------------------
  // Milestones — MilestonesController. Each call moves exactly one
  // MilestoneState transition forward; a 409 means the state already moved
  // (e.g. another tab already funded it) — see BusinessRules.AssertValidTransition.
  // ---------------------------------------------------------------------

  Future<void> fundMilestone(String token, String milestoneId) => _postAction(token, '/milestones/$milestoneId/fund');
  Future<void> startMilestone(String token, String milestoneId) => _postAction(token, '/milestones/$milestoneId/start');
  Future<void> submitMilestone(String token, String milestoneId) => _postAction(token, '/milestones/$milestoneId/submit');
  Future<void> approveMilestone(String token, String milestoneId) => _postAction(token, '/milestones/$milestoneId/approve');

  Future<void> _postAction(String token, String path) async {
    final response = await _http.post(Uri.parse('$_baseUrl$path'), headers: _authHeaders(token));
    if (response.statusCode != 200 && response.statusCode != 204) {
      throw ApiException(response.statusCode, response.body);
    }
  }

  // ---------------------------------------------------------------------
  // Freelancers directory + job posting — FreelancersController /
  // JobsController, Client-side "find new contractors" / "create project".
  // ---------------------------------------------------------------------

  Future<List<FreelancerListItem>> searchFreelancers(String token, {String? q}) async {
    final uri = Uri.parse('$_baseUrl/freelancers').replace(
      queryParameters: (q != null && q.isNotEmpty) ? {'q': q} : null,
    );
    final response = await _http.get(uri, headers: _authHeaders(token));
    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }
    final list = jsonDecode(response.body) as List<dynamic>;
    return list.map((f) => FreelancerListItem.fromJson(f as Map<String, dynamic>)).toList();
  }

  Future<void> createJob(
    String token, {
    required String title,
    required String description,
    required String roleCategory,
    int? budgetMinorMin,
    int? budgetMinorMax,
  }) async {
    final response = await _http.post(
      Uri.parse('$_baseUrl/jobs'),
      headers: _authHeaders(token),
      body: jsonEncode({
        'title': title,
        'description': description,
        'roleCategory': roleCategory,
        if (budgetMinorMin != null) 'budgetMinorMin': budgetMinorMin,
        if (budgetMinorMax != null) 'budgetMinorMax': budgetMinorMax,
      }),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw ApiException(response.statusCode, response.body);
    }
  }

  Future<void> submitProposal(
    String token, {
    required String jobId,
    required String coverNote,
    required int proposedRateMinor,
  }) async {
    final response = await _http.post(
      Uri.parse('$_baseUrl/jobs/$jobId/proposals'),
      headers: _authHeaders(token),
      body: jsonEncode({'coverNote': coverNote, 'proposedRateMinor': proposedRateMinor}),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw ApiException(response.statusCode, response.body);
    }
  }

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

// ---------------------------------------------------------------------
// Auth models — AuthController's LoginApiRequest/BuildUserPayload shape.
// ---------------------------------------------------------------------

/// `user.role` is always "Freelancer" or "Client" (Verqo.Domain.Enums.UserRole)
/// — never both on one account, so `freelancerProfileId`/`clientProfileId`
/// are mutually exclusive in practice even though the API returns both keys.
class SessionUser {
  final String id;
  final String email;
  final String role;
  final String displayName;
  final String? freelancerProfileId;
  final String? clientProfileId;
  final bool? isFullyVerified;

  SessionUser({
    required this.id,
    required this.email,
    required this.role,
    required this.displayName,
    this.freelancerProfileId,
    this.clientProfileId,
    this.isFullyVerified,
  });

  factory SessionUser.fromJson(Map<String, dynamic> json) => SessionUser(
        id: json['id'] as String,
        email: json['email'] as String,
        role: json['role'] as String,
        displayName: json['displayName'] as String,
        freelancerProfileId: json['freelancerProfileId'] as String?,
        clientProfileId: json['clientProfileId'] as String?,
        isFullyVerified: json['isFullyVerified'] as bool?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'role': role,
        'displayName': displayName,
        'freelancerProfileId': freelancerProfileId,
        'clientProfileId': clientProfileId,
        'isFullyVerified': isFullyVerified,
      };
}

class LoginResponse {
  final String token;
  final String expiresAt;
  final SessionUser user;

  LoginResponse({required this.token, required this.expiresAt, required this.user});

  factory LoginResponse.fromJson(Map<String, dynamic> json) => LoginResponse(
        token: json['token'] as String,
        expiresAt: json['expiresAt'] as String,
        user: SessionUser.fromJson(json['user'] as Map<String, dynamic>),
      );
}

// ---------------------------------------------------------------------
// Dashboard models — mirror DashboardController.cs's anonymous JSON shapes
// exactly (field-for-field), same contract the Angular web app's
// core/services/api.service.ts interfaces describe.
// ---------------------------------------------------------------------

class MilestoneSummary {
  final String id;
  final String title;
  final int contractValueMinor;
  final String state;
  final String? submittedAt;
  final String? reviewDeadlineAt;
  final String? releasedAt;

  MilestoneSummary({
    required this.id,
    required this.title,
    required this.contractValueMinor,
    required this.state,
    this.submittedAt,
    this.reviewDeadlineAt,
    this.releasedAt,
  });

  factory MilestoneSummary.fromJson(Map<String, dynamic> json) => MilestoneSummary(
        id: json['id'] as String,
        title: json['title'] as String,
        contractValueMinor: json['contractValueMinor'] as int,
        state: json['state'] as String,
        submittedAt: json['submittedAt'] as String?,
        reviewDeadlineAt: json['reviewDeadlineAt'] as String?,
        releasedAt: json['releasedAt'] as String?,
      );
}

class ContractSummary {
  final String id;
  final String scopeSummary;
  final String status;
  final String counterpartyName;
  final String? jobTitle;
  final List<MilestoneSummary> milestones;

  ContractSummary({
    required this.id,
    required this.scopeSummary,
    required this.status,
    required this.counterpartyName,
    this.jobTitle,
    required this.milestones,
  });

  /// `counterpartyName` reads `clientName` on the Freelancer payload and
  /// `freelancerName` on the Client payload — pass whichever key this
  /// contract came from.
  factory ContractSummary.fromJson(Map<String, dynamic> json, {required String counterpartyKey}) => ContractSummary(
        id: json['id'] as String,
        scopeSummary: json['scopeSummary'] as String,
        status: json['status'] as String,
        counterpartyName: json[counterpartyKey] as String,
        jobTitle: json['jobTitle'] as String?,
        milestones: (json['milestones'] as List<dynamic>)
            .map((m) => MilestoneSummary.fromJson(m as Map<String, dynamic>))
            .toList(),
      );
}

class RecommendedJob {
  final String id;
  final String title;
  final String roleCategory;
  final int? budgetMinorMin;
  final int? budgetMinorMax;
  final String clientName;

  RecommendedJob({
    required this.id,
    required this.title,
    required this.roleCategory,
    this.budgetMinorMin,
    this.budgetMinorMax,
    required this.clientName,
  });

  factory RecommendedJob.fromJson(Map<String, dynamic> json) => RecommendedJob(
        id: json['id'] as String,
        title: json['title'] as String,
        roleCategory: json['roleCategory'] as String,
        budgetMinorMin: json['budgetMinorMin'] as int?,
        budgetMinorMax: json['budgetMinorMax'] as int?,
        clientName: json['clientName'] as String,
      );
}

class FreelancerTaxSummary {
  final int fyToDateEarnedMinor;
  final int totalGstCollectedMinor;
  final int estimatedTdsMinor;
  final String note;

  FreelancerTaxSummary({
    required this.fyToDateEarnedMinor,
    required this.totalGstCollectedMinor,
    required this.estimatedTdsMinor,
    required this.note,
  });

  factory FreelancerTaxSummary.fromJson(Map<String, dynamic> json) => FreelancerTaxSummary(
        fyToDateEarnedMinor: json['fyToDateEarnedMinor'] as int,
        totalGstCollectedMinor: json['totalGstCollectedMinor'] as int,
        estimatedTdsMinor: json['estimatedTdsMinor'] as int,
        note: json['note'] as String,
      );
}

class FreelancerDashboard {
  final String displayName;
  final String primaryRole;
  final String experienceLevel;
  final bool isFullyVerified;
  final int activeContracts;
  final int totalEarnedMinor;
  final int pendingInEscrowMinor;
  final int openProposalsCount;
  final List<ContractSummary> contracts;
  final FreelancerTaxSummary taxSummary;
  final List<RecommendedJob> recommendedJobs;

  FreelancerDashboard({
    required this.displayName,
    required this.primaryRole,
    required this.experienceLevel,
    required this.isFullyVerified,
    required this.activeContracts,
    required this.totalEarnedMinor,
    required this.pendingInEscrowMinor,
    required this.openProposalsCount,
    required this.contracts,
    required this.taxSummary,
    required this.recommendedJobs,
  });

  factory FreelancerDashboard.fromJson(Map<String, dynamic> json) {
    final profile = json['profile'] as Map<String, dynamic>;
    final summary = json['summary'] as Map<String, dynamic>;
    return FreelancerDashboard(
      displayName: profile['displayName'] as String,
      primaryRole: profile['primaryRole'] as String,
      experienceLevel: profile['experienceLevel'] as String,
      isFullyVerified: profile['isFullyVerified'] as bool,
      activeContracts: summary['activeContracts'] as int,
      totalEarnedMinor: summary['totalEarnedMinor'] as int,
      pendingInEscrowMinor: summary['pendingInEscrowMinor'] as int,
      openProposalsCount: summary['openProposalsCount'] as int,
      contracts: (json['contracts'] as List<dynamic>)
          .map((c) => ContractSummary.fromJson(c as Map<String, dynamic>, counterpartyKey: 'clientName'))
          .toList(),
      taxSummary: FreelancerTaxSummary.fromJson(json['taxSummary'] as Map<String, dynamic>),
      recommendedJobs: (json['recommendedJobs'] as List<dynamic>)
          .map((j) => RecommendedJob.fromJson(j as Map<String, dynamic>))
          .toList(),
    );
  }
}

class PendingApproval {
  final String id;
  final String contractId;
  final String title;
  final int contractValueMinor;
  final String freelancerName;
  final String? reviewDeadlineAt;

  PendingApproval({
    required this.id,
    required this.contractId,
    required this.title,
    required this.contractValueMinor,
    required this.freelancerName,
    this.reviewDeadlineAt,
  });

  factory PendingApproval.fromJson(Map<String, dynamic> json) => PendingApproval(
        id: json['id'] as String,
        contractId: json['contractId'] as String,
        title: json['title'] as String,
        contractValueMinor: json['contractValueMinor'] as int,
        freelancerName: json['freelancerName'] as String,
        reviewDeadlineAt: json['reviewDeadlineAt'] as String?,
      );
}

class PostedJob {
  final String id;
  final String title;
  final String status;
  final int proposalCount;

  PostedJob({required this.id, required this.title, required this.status, required this.proposalCount});

  factory PostedJob.fromJson(Map<String, dynamic> json) => PostedJob(
        id: json['id'] as String,
        title: json['title'] as String,
        status: json['status'] as String,
        proposalCount: json['proposalCount'] as int,
      );
}

class ClientDashboard {
  final String companyName;
  final String? gstin;
  final String plan;
  final int activeContracts;
  final int escrowBalanceMinor;
  final int pendingApprovalsCount;
  final int openJobsCount;
  final List<ContractSummary> contracts;
  final List<PendingApproval> pendingApprovals;
  final List<PostedJob> postedJobs;

  ClientDashboard({
    required this.companyName,
    this.gstin,
    required this.plan,
    required this.activeContracts,
    required this.escrowBalanceMinor,
    required this.pendingApprovalsCount,
    required this.openJobsCount,
    required this.contracts,
    required this.pendingApprovals,
    required this.postedJobs,
  });

  factory ClientDashboard.fromJson(Map<String, dynamic> json) {
    final profile = json['profile'] as Map<String, dynamic>;
    final summary = json['summary'] as Map<String, dynamic>;
    return ClientDashboard(
      companyName: profile['companyName'] as String,
      gstin: profile['gstin'] as String?,
      plan: profile['plan'] as String,
      activeContracts: summary['activeContracts'] as int,
      escrowBalanceMinor: summary['escrowBalanceMinor'] as int,
      pendingApprovalsCount: summary['pendingApprovalsCount'] as int,
      openJobsCount: summary['openJobsCount'] as int,
      contracts: (json['contracts'] as List<dynamic>)
          .map((c) => ContractSummary.fromJson(c as Map<String, dynamic>, counterpartyKey: 'freelancerName'))
          .toList(),
      pendingApprovals: (json['pendingApprovals'] as List<dynamic>)
          .map((p) => PendingApproval.fromJson(p as Map<String, dynamic>))
          .toList(),
      postedJobs: (json['postedJobs'] as List<dynamic>).map((j) => PostedJob.fromJson(j as Map<String, dynamic>)).toList(),
    );
  }
}

class FreelancerListItem {
  final String id;
  final String displayName;
  final String primaryRole;
  final String experienceLevel;
  final int? hourlyRateMinor;
  final bool isFullyVerified;

  FreelancerListItem({
    required this.id,
    required this.displayName,
    required this.primaryRole,
    required this.experienceLevel,
    this.hourlyRateMinor,
    required this.isFullyVerified,
  });

  factory FreelancerListItem.fromJson(Map<String, dynamic> json) => FreelancerListItem(
        id: json['id'] as String,
        displayName: json['displayName'] as String,
        primaryRole: json['primaryRole'] as String,
        experienceLevel: json['experienceLevel'] as String,
        hourlyRateMinor: json['hourlyRateMinor'] as int?,
        isFullyVerified: json['isFullyVerified'] as bool,
      );
}
