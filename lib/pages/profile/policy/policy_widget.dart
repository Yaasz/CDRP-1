import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'policy_model.dart';
export 'policy_model.dart';

class PolicyWidget extends StatefulWidget {
  const PolicyWidget({super.key});

  static String routeName = 'Policy';
  static String routePath = '/policy';

  @override
  State<PolicyWidget> createState() => _PolicyWidgetState();
}

class _PolicyWidgetState extends State<PolicyWidget> {
  late PolicyModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PolicyModel());
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primary,
        appBar: AppBar(
          backgroundColor: FlutterFlowTheme.of(context).primary,
          automaticallyImplyLeading: false,
          leading: FlutterFlowIconButton(
            borderColor: Colors.transparent,
            borderRadius: 30.0,
            borderWidth: 1.0,
            buttonSize: 60.0,
            icon: Icon(
              Icons.arrow_back_ios_outlined,
              color: FlutterFlowTheme.of(context).secondary,
              size: 30.0,
            ),
            onPressed: () async {
              context.pop();
            },
          ),
          title: Align(
            alignment: AlignmentDirectional(1.0, 0.0),
            child: Text(
              'Privacy Policy',
              style: FlutterFlowTheme.of(context).headlineMedium.override(
                    font: GoogleFonts.interTight(
                      fontWeight: FlutterFlowTheme.of(context)
                          .headlineMedium
                          .fontWeight,
                      fontStyle:
                          FlutterFlowTheme.of(context).headlineMedium.fontStyle,
                    ),
                    color: FlutterFlowTheme.of(context).secondary,
                    fontSize: 22.0,
                    letterSpacing: 0.0,
                    fontWeight:
                        FlutterFlowTheme.of(context).headlineMedium.fontWeight,
                    fontStyle:
                        FlutterFlowTheme.of(context).headlineMedium.fontStyle,
                  ),
            ),
          ),
          actions: [],
          centerTitle: true,
          elevation: 2.0,
        ),
        body: SafeArea(
          top: true,
          child: Container(
            width: MediaQuery.sizeOf(context).width * 1.0,
            height: MediaQuery.sizeOf(context).height * 1.0,
            decoration: BoxDecoration(),
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(30.0, 0.0, 30.0, 0.0),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 15.0, 0.0, 0.0),
                          child: Text(
                            'Last Udated 14/08/2024',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  font: GoogleFonts.inter(
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                                  color: FlutterFlowTheme.of(context).secondary,
                                  letterSpacing: 0.0,
                                  fontWeight: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontWeight,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontStyle,
                                ),
                          ),
                        ),
                      ],
                    ),
                    Flexible(
                      child: Align(
                        alignment: AlignmentDirectional(-1.0, 0.0),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 15.0, 0.0, 0.0),
                          child: Text(
                            'This Privacy Policy applies solely to the Crowdsourced Disaster Response Platform (CDRP) mobile application (the \"App\") developed and operated by Salamati Cyber Soft. It explains how we collect, use, and protect your information when you use our mobile app. By using the App, you agree to this Privacy Policy.\n\n         1. Information We Collect via the App\nPersonal Information\n\nEmail Address: Required for login through Firebase Authentication.\n\nOptional Name/Profile Info: If you choose to create a profile.\n\nLocation Information\n\nWe access your real-time geolocation (only with your permission) to:\n\nDisplay location-based disaster alerts.\n\nHelp responders and volunteers locate your reported incidents.\n\nUser-Generated Content\n\nAny text, images, or reports you submit via the app (e.g., reporting a disaster or signing up to volunteer).\n\nApp Usage Data\n\nAnonymous data like device type, OS version, crash logs, and app interactions—used to improve performance and user experience.\n\nFirebase Integration\n\nWe use Firebase Authentication and Cloud Firestore to store user data, including disaster reports, volunteer data, and synced government alerts.\n\n        2. How We Use Your Data\nTo authenticate and manage user accounts.\n\nTo show alerts and opportunities based on your location.\n\nTo support community-based reporting and response.\n\nTo improve app stability, performance, and security.\n\nTo coordinate communication between users and relevant authorities or volunteers.\n\n        3. Data Sharing\nWe do not sell or rent your personal information.\n\nWe only share data:\n\nWith emergency services or response teams, when necessary (e.g., your location if you report a disaster).\n\nWith authorized volunteers, only when needed for aid coordination.\n\nWhen legally required to comply with national laws or regulations.\n\nAll shared data respects user privacy and complies with Firebase’s security standards.\n\n        4. Data Retention and Control\nWe retain your information as long as you have an active account. You may:\n\nRequest to view or delete your personal data.\n\nTurn off location permissions at any time via your phone settings.\n\nTo request data deletion, contact us at [your support email].\n\n        5. Security Measures\nWe use:\n\nSecure Firebase Authentication\n\nEncrypted Firestore database\n\nAccess controls and best practices to prevent unauthorized access.\n\n        6. Children\'s Privacy\nThe app is not intended for children under 13. We do not knowingly collect data from children. If discovered, such data will be promptly deleted.\n\n        7. Updates to This Policy\nThis Privacy Policy may be updated. Changes will be reflected in the app and, when significant, we’ll notify you.\n\n',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  font: GoogleFonts.leagueSpartan(
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                                  color:
                                      FlutterFlowTheme.of(context).primaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontWeight,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontStyle,
                                ),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 10.0, 0.0, 0.0),
                      child: RichText(
                        textScaler: MediaQuery.of(context).textScaler,
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text:
                                  'Welcome to the Crowdsourced Disaster Response Platform (CDRP) mobile app (“the App”). By downloading, installing, or using this App, you agree to be bound by the following terms and conditions. If you do not agree, please do not use the App.\n\n',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    letterSpacing: 0.0,
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                            ),
                            TextSpan(
                              text: '1. Use of the App\n\n',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.bold,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    color:
                                        FlutterFlowTheme.of(context).secondary,
                                    fontSize: 13.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                            ),
                            TextSpan(
                              text:
                                  'The CDRP App is intended to support community-based disaster reporting, volunteer coordination, and information sharing. You agree to use the App only for lawful and responsible purposes.\n\nYou must:\n\nBe at least 13 years old to use this App.\n\n',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    letterSpacing: 0.0,
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                            ),
                            TextSpan(
                              text: '2. User Accounts\n\n',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.w800,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    color:
                                        FlutterFlowTheme.of(context).secondary,
                                    fontSize: 13.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w800,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                            ),
                            TextSpan(
                              text:
                                  'You must log in via Firebase Authentication to access certain features.\n\nYou are responsible for maintaining the security of your account and activity.\n\nYou may delete your account at any time by contacting us or via the app settings (if available).\n\n',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    letterSpacing: 0.0,
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                            ),
                            TextSpan(
                              text: '3. User-Submitted Content\n\n',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.bold,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    color:
                                        FlutterFlowTheme.of(context).secondary,
                                    fontSize: 13.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                            ),
                            TextSpan(
                              text:
                                  'By submitting reports, messages, or media:\n\nYou grant us permission to store, display, and share this content with relevant users, organizations, or authorities.\n\nYou confirm that the content is accurate and does not violate any laws or third-party rights.\n\nWe reserve the right to remove or restrict content that is false, offensive, or harmful.\n\n',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    letterSpacing: 0.0,
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                            ),
                            TextSpan(
                              text: '4. Location Services\n\n',
                              style: TextStyle(
                                color: FlutterFlowTheme.of(context).secondary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            TextSpan(
                              text:
                                  'If you enable location services:\nThe App may collect and use your real-time location to show relevant alerts, allow others to find you in case of emergency, or coordinate volunteers.\n\nYou can disable location tracking anytime through your device settings.\n\n',
                              style: TextStyle(),
                            ),
                            TextSpan(
                              text: '5. Data Usage and Privacy\n\n',
                              style: TextStyle(
                                color: FlutterFlowTheme.of(context).secondary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            TextSpan(
                              text:
                                  'Your personal data is handled according to our Privacy Policy. By using the App, you consent to our data collection and usage practices as described there.\n\n',
                              style: TextStyle(),
                            ),
                            TextSpan(
                              text: '6. Intellectual Property\n\n',
                              style: TextStyle(
                                color: FlutterFlowTheme.of(context).secondary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            TextSpan(
                              text:
                                  'All content and code in the App (excluding user submissions) is the property of Salamati Cyber Soft. You may not reproduce, modify, or distribute the App or any of its content without permission.\n\n',
                              style: TextStyle(),
                            ),
                            TextSpan(
                              text: '7. Limitation of Liability\n\n',
                              style: TextStyle(
                                color: FlutterFlowTheme.of(context).secondary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            TextSpan(
                              text:
                                  'We provide the CDRP App on an “as-is” basis. While we strive for accuracy and availability:\n\nWe do not guarantee that the App will always function without errors or interruptions.\n\nWe are not liable for any damages, losses, or delays caused by use or misuse of the App, including incorrect disaster data or volunteer coordination.\n\n',
                              style: TextStyle(),
                            ),
                            TextSpan(
                              text: '8. Modifications\n\n',
                              style: TextStyle(
                                color: FlutterFlowTheme.of(context).secondary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            TextSpan(
                              text:
                                  'We may update these Terms and Conditions at any time. Continued use of the App after changes means you accept the new terms. Major updates will be communicated through the App or email (if applicable).\n\n',
                              style: TextStyle(),
                            ),
                            TextSpan(
                              text: '9. Termination\n\n',
                              style: TextStyle(
                                color: FlutterFlowTheme.of(context).secondary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            TextSpan(
                              text:
                                  'We reserve the right to suspend or terminate your access if:\n\nYou violate these Terms.\n\nYou misuse the platform or submit false reports.',
                              style: TextStyle(),
                            )
                          ],
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    letterSpacing: 0.0,
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                  ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
