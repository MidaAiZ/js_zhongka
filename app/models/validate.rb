module Validate
  VALID_ACCOUNT_REGEX = /\A[a-zA-Z0-9_\u4e00-\u9fa5]+\z/
  VALID_PHONE_REGEX = /\A1[0-9]{10}\z/
  VALID_EMAIL_REGEX = /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\z/
  VALID_URL_REGEX = /\A(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/\?#]\S*)?\z/
  VALID_DATE_REGEX = /\A\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\z/
  VALID_TIME_REGEX = /\A((0\d|1\d)|(2[0123]))(:[0-5]\d){1,2}\z/
  VALID_NUMBER_REGEX =  /\A[+-]?\d+(\.\d+)?\z/
  VALID_INT_REGEX = /\A[+-]?[1-9]\d*\z/
  VALID_COLOR_REGEX = /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z/
  VALID_ID_REGEX = /(\A\d{15}\z)|(\A\d{17}([0-9]|X)\z)/
  VALID_PASSWORD_REGEX = /[a-zA-Z0-9,.!@#$%&'*+\/\]\[=?^_`{|}~-]{6,}\z/
  VALID_SEX_REGEX = /\A(\u7537|\u5973)\z/
end
