import 'package:rxdart/rxdart.dart';

import 'custom_auth_manager.dart';

class CDRPProjectAuthUser {
  CDRPProjectAuthUser({required this.loggedIn, this.uid});

  bool loggedIn;
  String? uid;
}

/// Generates a stream of the authenticated user.
BehaviorSubject<CDRPProjectAuthUser> cDRPProjectAuthUserSubject =
    BehaviorSubject.seeded(CDRPProjectAuthUser(loggedIn: false));
Stream<CDRPProjectAuthUser> cDRPProjectAuthUserStream() =>
    cDRPProjectAuthUserSubject
        .asBroadcastStream()
        .map((user) => currentUser = user);
