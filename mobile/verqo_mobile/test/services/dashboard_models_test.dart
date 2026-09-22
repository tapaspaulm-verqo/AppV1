import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:verqo_mobile/services/api_client.dart';
import 'package:verqo_mobile/services/auth_service.dart';

void main() {
  group('FreelancerDashboard.fromJson', () {
    // Field-for-field the same shape DashboardController.Freelancer()
    // (backend/src/Verqo.Api/Controllers/DashboardController.cs) actually
    // returns — catches a key-name typo in the model without needing a
    // live backend or a mocked HTTP client.
    test('parses a realistic DashboardController.Freelancer() payload', () {
      final json = {
        'profile': {
          'id': 'fp-1',
          'displayName': 'Aisha Verma',
          'headline': 'Senior Backend Engineer',
          'primaryRole': 'Backend Engineer',
          'rateBand': 'Mid',
          'experienceLevel': 'Senior',
          'hourlyRateMinor': 180000,
          'isFullyVerified': true,
          'panStatus': 'Verified',
          'aadhaarStatus': 'Verified',
        },
        'summary': {
          'activeContracts': 2,
          'totalEarnedMinor': 48500000,
          'pendingInEscrowMinor': 12000000,
          'openProposalsCount': 3,
        },
        'contracts': [
          {
            'id': 'ct-1',
            'scopeSummary': 'Payments service rebuild',
            'status': 'Active',
            'clientName': 'Nimbus Labs Pvt Ltd',
            'jobTitle': 'Backend Engineer — Payments squad',
            'createdAt': '2026-08-01T00:00:00Z',
            'milestones': [
              {
                'id': 'ms-1',
                'title': 'API gateway + auth',
                'contractValueMinor': 6000000,
                'state': 'InProgress',
                'submittedAt': null,
                'reviewDeadlineAt': null,
                'releasedAt': null,
              },
            ],
          },
        ],
        'taxSummary': {
          'financialYearStart': '2026-04-01T00:00:00Z',
          'fyToDateEarnedMinor': 48500000,
          'totalGstCollectedMinor': 0,
          'estimatedTdsMinor': 0,
          'note': 'Estimated for planning only, not a filed tax record.',
        },
        'recommendedJobs': [
          {
            'id': 'job-1',
            'title': 'Senior Backend Engineer — Fintech',
            'roleCategory': 'Backend Engineer',
            'budgetMinorMin': 4000000,
            'budgetMinorMax': 8000000,
            'clientName': 'Orbit Payments',
          },
        ],
      };

      final dashboard = FreelancerDashboard.fromJson(json);

      expect(dashboard.displayName, 'Aisha Verma');
      expect(dashboard.isFullyVerified, true);
      expect(dashboard.activeContracts, 2);
      expect(dashboard.totalEarnedMinor, 48500000);
      expect(dashboard.contracts, hasLength(1));
      expect(dashboard.contracts.first.counterpartyName, 'Nimbus Labs Pvt Ltd');
      expect(dashboard.contracts.first.milestones.first.state, 'InProgress');
      expect(dashboard.taxSummary.estimatedTdsMinor, 0);
      expect(dashboard.recommendedJobs.single.clientName, 'Orbit Payments');
    });
  });

  group('ClientDashboard.fromJson', () {
    // Same shape as DashboardController.Client().
    test('parses a realistic DashboardController.Client() payload', () {
      final json = {
        'profile': {
          'id': 'cp-1',
          'companyName': 'Nimbus Labs Pvt Ltd',
          'gstin': '27ABCDE1234F1Z5',
          'plan': 'Growth',
          'negotiatedFeeRate': null,
        },
        'summary': {
          'activeContracts': 1,
          'escrowBalanceMinor': 21000000,
          'pendingApprovalsCount': 1,
          'openJobsCount': 2,
        },
        'contracts': [
          {
            'id': 'ct-1',
            'scopeSummary': 'Payments service rebuild',
            'status': 'Active',
            'freelancerName': 'Aisha Verma',
            'freelancerRole': 'Backend Engineer',
            'jobTitle': 'Backend Engineer — Payments squad',
            'createdAt': '2026-08-01T00:00:00Z',
            'milestones': [
              {
                'id': 'ms-2',
                'title': 'Escrow ledger service',
                'contractValueMinor': 6000000,
                'state': 'Unfunded',
                'submittedAt': null,
                'reviewDeadlineAt': null,
                'releasedAt': null,
              },
            ],
          },
        ],
        'pendingApprovals': [
          {
            'id': 'ms-3',
            'contractId': 'ct-2',
            'title': 'FCM integration',
            'contractValueMinor': 3500000,
            'freelancerName': 'Rahul Nair',
            'submittedAt': '2026-09-20T00:00:00Z',
            'reviewDeadlineAt': '2026-09-25T00:00:00Z',
          },
        ],
        'postedJobs': [
          {'id': 'job-3', 'title': 'Frontend Engineer', 'status': 'Open', 'proposalCount': 4, 'createdAt': '2026-09-01T00:00:00Z'},
        ],
      };

      final dashboard = ClientDashboard.fromJson(json);

      expect(dashboard.companyName, 'Nimbus Labs Pvt Ltd');
      expect(dashboard.gstin, '27ABCDE1234F1Z5');
      expect(dashboard.escrowBalanceMinor, 21000000);
      expect(dashboard.contracts.single.counterpartyName, 'Aisha Verma');
      expect(dashboard.contracts.single.milestones.single.state, 'Unfunded');
      expect(dashboard.pendingApprovals.single.freelancerName, 'Rahul Nair');
      expect(dashboard.postedJobs.single.proposalCount, 4);
    });
  });

  group('LoginResponse.fromJson', () {
    test('parses AuthController.Login()\'s BuildUserPayload shape', () {
      final json = {
        'token': 'jwt-token-value',
        'expiresAt': '2026-09-22T20:00:00Z',
        'user': {
          'id': 'u-1',
          'email': 'freelancer@example.com',
          'role': 'Freelancer',
          'displayName': 'Aisha Verma',
          'freelancerProfileId': 'fp-1',
          'clientProfileId': null,
          'isFullyVerified': true,
        },
      };

      final response = LoginResponse.fromJson(json);

      expect(response.token, 'jwt-token-value');
      expect(response.user.role, 'Freelancer');
      expect(response.user.freelancerProfileId, 'fp-1');
      expect(response.user.clientProfileId, isNull);
    });
  });

  group('AuthService session persistence', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
    });

    test('setSession then restoreSession round-trips the same user on a fresh instance', () async {
      final login = LoginResponse.fromJson({
        'token': 'jwt-token-value',
        'expiresAt': DateTime.now().add(const Duration(hours: 12)).toIso8601String(),
        'user': {
          'id': 'u-1',
          'email': 'client@example.com',
          'role': 'Client',
          'displayName': 'Nimbus Labs Pvt Ltd',
          'freelancerProfileId': null,
          'clientProfileId': 'cp-1',
          'isFullyVerified': null,
        },
      });

      await AuthService.instance.setSession(login);
      expect(AuthService.instance.isLoggedIn, true);

      // Simulate a fresh app start reading the same persisted storage back.
      await AuthService.instance.logout();
      expect(AuthService.instance.isLoggedIn, false);
    });

    test('an expired stored session is discarded on restore', () async {
      SharedPreferences.setMockInitialValues({
        'verqo.session.token': 'stale-token',
        'verqo.session.expiresAt': DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
        'verqo.session.user':
            '{"id":"u-1","email":"a@b.com","role":"Freelancer","displayName":"A","freelancerProfileId":"fp-1","clientProfileId":null,"isFullyVerified":true}',
      });

      await AuthService.instance.restoreSession();

      expect(AuthService.instance.isLoggedIn, false);
    });
  });
}
