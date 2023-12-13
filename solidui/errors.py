# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.


from flask import request
from flask_babel import lazy_gettext as _
from solidui.common.backports import StrEnum


class SolidUIErrorType(StrEnum):
    SUCCESS = "SUCCESS"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
    USER_NAME_EXIST = "USER_NAME_EXIST"
    USER_NAME_NULL = "USER_NAME_NULL"
    PASSWORD_NAME_NULL = "PASSWORD_NAME_NULL"
    USER_LOGIN_FAILURE = "USER_LOGIN_FAILURE"
    LOGIN_OUT_FAILURE = "LOGIN_OUT_FAILURE"
    UPDATE_PROJECT_ERROR = "UPDATE_PROJECT_ERROR"
    QUERY_PROJECT_DETAILS_ERROR = "QUERY_PROJECT_DETAILS_ERROR"
    CREATE_PROJECT_ERROR = "CREATE_PROJECT_ERROR"
    LOGIN_USER_QUERY_PROJECT_LIST_PAGING_ERROR = "LOGIN_USER_QUERY_PROJECT_LIST_PAGING_ERROR"
    DELETE_PROJECT_ERROR = "DELETE_PROJECT_ERROR"
    PROJECT_ALREADY_EXISTS_ERROR = "PROJECT_ALREADY_EXISTS_ERROR"
    PROJECT_NOT_EXISTS_ERROR = "PROJECT_NOT_EXISTS_ERROR"
    DATASOURCE_NOT_EXISTS_ERROR = "DATASOURCE_NOT_EXISTS_ERROR"
    DELETE_DATASOURCE_ERROR = "DELETE_DATASOURCE_ERROR"
    CREATE_DATASOURCE_ERROR = "CREATE_DATASOURCE_ERROR"
    UPDATE_DATASOURCE_ERROR = "UPDATE_DATASOURCE_ERROR"
    QUERY_DATASOURCE_ERROR = "QUERY_DATASOURCE_ERROR"
    DATASOURCE_ALREADY_EXISTS_ERROR = "DATASOURCE_ALREADY_EXISTS_ERROR"
    CREATE_DATASOURCE_TYPE_ERROR = "CREATE_DATASOURCE_TYPE_ERROR"
    QUERY_DATASOURCE_TYPE_ERROR = "QUERY_DATASOURCE_TYPE_ERROR"
    CREATE_DATASOURCE_TYPE_KEY_ERROR = "CREATE_DATASOURCE_TYPE_KEY_ERROR"
    DELETE_DATASOURCE_TYPE_KEY_ERROR = "DELETE_DATASOURCE_TYPE_KEY_ERROR"
    UPDATE_DATASOURCE_TYPE_KEY_ERROR = "UPDATE_DATASOURCE_TYPE_KEY_ERROR"
    QUERY_DATASOURCE_TYPE_KEY_ERROR = "QUERY_DATASOURCE_TYPE_KEY_ERROR"
    QUERY_METADATA_DB_ERROR = "QUERY_METADATA_DB_ERROR"
    QUERY_METADATA_TABLE_ERROR = "QUERY_METADATA_TABLE_ERROR"
    QUERY_METADATA_SQL_ERROR = "QUERY_METADATA_SQL_ERROR"
    QUERY_METADATA_CONN_ERROR = "QUERY_METADATA_CONN_ERROR"
    QUERY_JOB_PAGE_ERROR = "QUERY_JOB_PAGE_ERROR"
    CREATE_JOB_PAGE_ERROR = "CREATE_JOB_PAGE_ERROR"
    UPDATE_JOB_PAGE_ERROR = "UPDATE_JOB_PAGE_ERROR"
    DELETE_JOB_PAGE_ERROR = "DELETE_JOB_PAGE_ERROR"
    QUERY_JOB_ERROR = "QUERY_JOB_ERROR"
    CREATE_JOB_ERROR = "CREATE_JOB_ERROR"
    UPDATE_JOB_ERROR = "UPDATE_JOB_ERROR"
    DELETE_JOB_ERROR = "DELETE_JOB_ERROR"
    JOB_PAGE_ALREADY_EXISTS_ERROR = "JOB_PAGE_ALREADY_EXISTS_ERROR"
    QUERY_MODEL_TYPE_ERROR = "QUERY_MODEL_TYPE_ERROR"
    FAILED = "FAILED"


ISSUE_CODES = {
    10000: _("Internal Server Error"),
    10001: _("Username already exists"),
    10002: _("Username cannot be empty"),
    10003: _("Password cannot be empty"),
    10004: _("User login failed"),
    10005: _("User logout failed"),
    10046: _("Failed to update project"),
    10047: _("Failed to query project details"),
    10048: _("Failed to create project"),
    10049: _("Failed to paginate project list"),
    10050: _("Failed to delete project"),
    10052: _("Project already exists"),
    10053: _("Project does not exist"),
    10054: _("Datasource does not exist"),
    10055: _("Failed to delete datasource"),
    10056: _("Failed to create datasource"),
    10057: _("Failed to update datasource"),
    10058: _("Failed to query datasource"),
    10059: _("Datasource already exists"),
    10060: _("Failed to create datasource type"),
    10061: _("Failed to query datasource type"),
    10062: _("Failed to create datasource type key"),
    10063: _("Failed to delete datasource type key"),
    10064: _("Failed to update datasource type key"),
    10065: _("Failed to query datasource type key"),
    10066: _("Failed to query metadata database"),
    10067: _("Failed to query metadata table"),
    10068: _("Failed to query metadata SQL"),
    10069: _("Failed to query metadata connection"),
    10070: _("Failed to query job page"),
    10071: _("Failed to create job page"),
    10072: _("Failed to update job page"),
    10073: _("Failed to delete job page"),
    10074: _("Failed to query job"),
    10075: _("Failed to create job"),
    10076: _("Failed to update job"),
    10077: _("Failed to delete job"),
    10078: _("Job page already exists"),
    10080: _("Failed to query model types"),
    1: _("Request failed"),
}


ERROR_TYPES_TO_CODES_MAPPING = {
    SolidUIErrorType.INTERNAL_SERVER_ERROR: [10000],
    SolidUIErrorType.USER_NAME_EXIST: [10001],
    SolidUIErrorType.USER_NAME_NULL: [10002],
    SolidUIErrorType.PASSWORD_NAME_NULL: [10003],
    SolidUIErrorType.USER_LOGIN_FAILURE: [10004],
    SolidUIErrorType.LOGIN_OUT_FAILURE: [10005],
    SolidUIErrorType.UPDATE_PROJECT_ERROR: [10046],
    SolidUIErrorType.QUERY_PROJECT_DETAILS_ERROR: [10047],
    SolidUIErrorType.CREATE_PROJECT_ERROR: [10048],
    SolidUIErrorType.LOGIN_USER_QUERY_PROJECT_LIST_PAGING_ERROR: [10049],
    SolidUIErrorType.DELETE_PROJECT_ERROR: [10050],
    SolidUIErrorType.PROJECT_ALREADY_EXISTS_ERROR: [10052],
    SolidUIErrorType.PROJECT_NOT_EXISTS_ERROR: [10053],
    SolidUIErrorType.DATASOURCE_NOT_EXISTS_ERROR: [10054],
    SolidUIErrorType.DELETE_DATASOURCE_ERROR: [10055],
    SolidUIErrorType.CREATE_DATASOURCE_ERROR: [10056],
    SolidUIErrorType.UPDATE_DATASOURCE_ERROR: [10057],
    SolidUIErrorType.QUERY_DATASOURCE_ERROR: [10058],
    SolidUIErrorType.DATASOURCE_ALREADY_EXISTS_ERROR: [10059],
    SolidUIErrorType.CREATE_DATASOURCE_TYPE_ERROR: [10060],
    SolidUIErrorType.QUERY_DATASOURCE_TYPE_ERROR: [10061],
    SolidUIErrorType.CREATE_DATASOURCE_TYPE_KEY_ERROR: [10062],
    SolidUIErrorType.DELETE_DATASOURCE_TYPE_KEY_ERROR: [10063],
    SolidUIErrorType.UPDATE_DATASOURCE_TYPE_KEY_ERROR: [10064],
    SolidUIErrorType.QUERY_DATASOURCE_TYPE_KEY_ERROR: [10065],
    SolidUIErrorType.QUERY_METADATA_DB_ERROR: [10066],
    SolidUIErrorType.QUERY_METADATA_TABLE_ERROR: [10067],
    SolidUIErrorType.QUERY_METADATA_SQL_ERROR: [10068],
    SolidUIErrorType.QUERY_METADATA_CONN_ERROR: [10069],
    SolidUIErrorType.QUERY_JOB_PAGE_ERROR: [10070],
    SolidUIErrorType.CREATE_JOB_PAGE_ERROR: [10071],
    SolidUIErrorType.UPDATE_JOB_PAGE_ERROR: [10072],
    SolidUIErrorType.DELETE_JOB_PAGE_ERROR: [10073],
    SolidUIErrorType.QUERY_JOB_ERROR: [10074],
    SolidUIErrorType.CREATE_JOB_ERROR: [10075],
    SolidUIErrorType.UPDATE_JOB_ERROR: [10076],
    SolidUIErrorType.DELETE_JOB_ERROR: [10077],
    SolidUIErrorType.JOB_PAGE_ALREADY_EXISTS_ERROR: [10078],
    SolidUIErrorType.QUERY_MODEL_TYPE_ERROR: [10080],
    SolidUIErrorType.FAILED: [1],
}
