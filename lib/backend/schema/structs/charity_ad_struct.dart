// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class CharityAdStruct extends BaseStruct {
  CharityAdStruct({
    String? nameOfCharity,
    String? description,
    String? image,
    int? duration,
    DateTime? expiresAt,
    String? id,
    String? status,
  })  : _nameOfCharity = nameOfCharity,
        _description = description,
        _image = image,
        _duration = duration,
        _expiresAt = expiresAt,
        _id = id,
        _status = status;

  // "nameOfCharity" field.
  String? _nameOfCharity;
  String get nameOfCharity => _nameOfCharity ?? '';
  set nameOfCharity(String? val) => _nameOfCharity = val;

  bool hasNameOfCharity() => _nameOfCharity != null;

  // "description" field.
  String? _description;
  String get description => _description ?? '';
  set description(String? val) => _description = val;

  bool hasDescription() => _description != null;

  // "image" field.
  String? _image;
  String get image => _image ?? '';
  set image(String? val) => _image = val;

  bool hasImage() => _image != null;

  // "duration" field.
  int? _duration;
  int get duration => _duration ?? 0;
  set duration(int? val) => _duration = val;

  void incrementDuration(int amount) => duration = duration + amount;

  bool hasDuration() => _duration != null;

  // "expiresAt" field.
  DateTime? _expiresAt;
  DateTime? get expiresAt => _expiresAt;
  set expiresAt(DateTime? val) => _expiresAt = val;

  bool hasExpiresAt() => _expiresAt != null;

  // "id" field.
  String? _id;
  String get id => _id ?? '';
  set id(String? val) => _id = val;

  bool hasId() => _id != null;

  // "status" field.
  String? _status;
  String get status => _status ?? '';
  set status(String? val) => _status = val;

  bool hasStatus() => _status != null;

  static CharityAdStruct fromMap(Map<String, dynamic> data) => CharityAdStruct(
        nameOfCharity: data['nameOfCharity'] as String?,
        description: data['description'] as String?,
        image: data['image'] as String?,
        duration: castToType<int>(data['duration']),
        expiresAt: data['expiresAt'] as DateTime?,
        id: data['id'] as String?,
        status: data['status'] as String?,
      );

  static CharityAdStruct? maybeFromMap(dynamic data) => data is Map
      ? CharityAdStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'nameOfCharity': _nameOfCharity,
        'description': _description,
        'image': _image,
        'duration': _duration,
        'expiresAt': _expiresAt,
        'id': _id,
        'status': _status,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'nameOfCharity': serializeParam(
          _nameOfCharity,
          ParamType.String,
        ),
        'description': serializeParam(
          _description,
          ParamType.String,
        ),
        'image': serializeParam(
          _image,
          ParamType.String,
        ),
        'duration': serializeParam(
          _duration,
          ParamType.int,
        ),
        'expiresAt': serializeParam(
          _expiresAt,
          ParamType.DateTime,
        ),
        'id': serializeParam(
          _id,
          ParamType.String,
        ),
        'status': serializeParam(
          _status,
          ParamType.String,
        ),
      }.withoutNulls;

  static CharityAdStruct fromSerializableMap(Map<String, dynamic> data) =>
      CharityAdStruct(
        nameOfCharity: deserializeParam(
          data['nameOfCharity'],
          ParamType.String,
          false,
        ),
        description: deserializeParam(
          data['description'],
          ParamType.String,
          false,
        ),
        image: deserializeParam(
          data['image'],
          ParamType.String,
          false,
        ),
        duration: deserializeParam(
          data['duration'],
          ParamType.int,
          false,
        ),
        expiresAt: deserializeParam(
          data['expiresAt'],
          ParamType.DateTime,
          false,
        ),
        id: deserializeParam(
          data['id'],
          ParamType.String,
          false,
        ),
        status: deserializeParam(
          data['status'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'CharityAdStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is CharityAdStruct &&
        nameOfCharity == other.nameOfCharity &&
        description == other.description &&
        image == other.image &&
        duration == other.duration &&
        expiresAt == other.expiresAt &&
        id == other.id &&
        status == other.status;
  }

  @override
  int get hashCode => const ListEquality().hash(
      [nameOfCharity, description, image, duration, expiresAt, id, status]);
}

CharityAdStruct createCharityAdStruct({
  String? nameOfCharity,
  String? description,
  String? image,
  int? duration,
  DateTime? expiresAt,
  String? id,
  String? status,
}) =>
    CharityAdStruct(
      nameOfCharity: nameOfCharity,
      description: description,
      image: image,
      duration: duration,
      expiresAt: expiresAt,
      id: id,
      status: status,
    );
