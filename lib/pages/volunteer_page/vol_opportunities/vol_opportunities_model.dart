import '/flutter_flow/flutter_flow_util.dart';
import 'vol_opportunities_widget.dart' show VolOpportunitiesWidget;
import 'package:flutter/material.dart';

class VolOpportunitiesModel extends FlutterFlowModel<VolOpportunitiesWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode;
  TextEditingController? textController;
  String? Function(BuildContext, String?)? textControllerValidator;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    textFieldFocusNode?.dispose();
    textController?.dispose();
  }
}
