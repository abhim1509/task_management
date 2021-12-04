const http_codes = require('./http_codes')

http_status_codes = {
    HTTP_SUCCESS_CREATION : http_codes.http_constants.SUCCESS_CREATED_STATUS,
    HTTP_SERVER_ERROR : http_codes.http_constants.SERVER_ERROR,
    HTTP_SUCCESS_RETRIEVED : http_codes.http_constants.SUCCESS_RETREIVED_STATUS,
    HTTP_UNAUTHORIZED_ERROR : http_codes.http_constants.UNAUTHORIZED_STATUS,
    HTTP_BAD_REQUEST : http_codes.http_constants.BAD_REQUEST,
    HTTP_STATUS_NOT_FOUND : http_codes.http_constants.STATUS_NOT_FOUND
}

module.exports.HTTP_SUCCESS_CREATION = http_status_codes.HTTP_SUCCESS_CREATION;
module.exports.HTTP_SERVER_ERROR = http_status_codes.HTTP_SERVER_ERROR;
module.exports.HTTP_SUCCESS_RETRIEVED = http_status_codes.HTTP_SUCCESS_RETRIEVED;
module.exports.HTTP_UNAUTHORIZED_ERROR = http_status_codes.HTTP_UNAUTHORIZED_ERROR;
module.exports.HTTP_BAD_REQUEST = http_status_codes.HTTP_BAD_REQUEST;
module.exports.HTTP_STATUS_NOT_FOUND = http_status_codes.HTTP_STATUS_NOT_FOUND;
