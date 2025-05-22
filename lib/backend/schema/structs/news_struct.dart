// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class NewsStruct extends BaseStruct {
  NewsStruct({
    String? title,
    String? content,
    String? image,
    String? createdAt,
  })  : _title = title,
        _content = content,
        _image = image,
        _createdAt = createdAt;

  // "title" field.
  String? _title;
  String get title => _title ?? '';
  set title(String? val) => _title = val;

  bool hasTitle() => _title != null;

  // "content" field.
  String? _content;
  String get content => _content ?? '';
  set content(String? val) => _content = val;

  bool hasContent() => _content != null;

  // "image" field.
  String? _image;
  String get image => _image ?? '';
  set image(String? val) => _image = val;

  bool hasImage() => _image != null;

  // "createdAt" field.
  String? _createdAt;
  String get createdAt => _createdAt ?? '';
  set createdAt(String? val) => _createdAt = val;

  bool hasCreatedAt() => _createdAt != null;

  static NewsStruct fromMap(Map<String, dynamic> data) => NewsStruct(
        title: data['title'] as String?,
        content: data['content'] as String?,
        image: data['image'] as String?,
        createdAt: data['createdAt'] as String?,
      );

  static NewsStruct? maybeFromMap(dynamic data) =>
      data is Map ? NewsStruct.fromMap(data.cast<String, dynamic>()) : null;

  Map<String, dynamic> toMap() => {
        'title': _title,
        'content': _content,
        'image': _image,
        'createdAt': _createdAt,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'title': serializeParam(
          _title,
          ParamType.String,
        ),
        'content': serializeParam(
          _content,
          ParamType.String,
        ),
        'image': serializeParam(
          _image,
          ParamType.String,
        ),
        'createdAt': serializeParam(
          _createdAt,
          ParamType.String,
        ),
      }.withoutNulls;

  static NewsStruct fromSerializableMap(Map<String, dynamic> data) =>
      NewsStruct(
        title: deserializeParam(
          data['title'],
          ParamType.String,
          false,
        ),
        content: deserializeParam(
          data['content'],
          ParamType.String,
          false,
        ),
        image: deserializeParam(
          data['image'],
          ParamType.String,
          false,
        ),
        createdAt: deserializeParam(
          data['createdAt'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'NewsStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is NewsStruct &&
        title == other.title &&
        content == other.content &&
        image == other.image &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode =>
      const ListEquality().hash([title, content, image, createdAt]);
}

NewsStruct createNewsStruct({
  String? title,
  String? content,
  String? image,
  String? createdAt,
}) =>
    NewsStruct(
      title: title,
      content: content,
      image: image,
      createdAt: createdAt,
    );
