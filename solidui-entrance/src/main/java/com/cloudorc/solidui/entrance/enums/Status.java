/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.cloudorc.solidui.entrance.enums;

import org.springframework.context.i18n.LocaleContextHolder;

import java.util.Locale;
import java.util.Optional;

public enum Status {
    SUCCESS(0, "success", "成功"),
    INTERNAL_SERVER_ERROR_ARGS(10000, "Internal Server Error: {0}", "服务端异常: {0}"),
    USER_NAME_EXIST(10001, "user name already exists", "用户名已存在"),
    USER_NAME_NULL(10002, "user name is null", "用户名不能为空"),
    PASSWORD_NAME_NULL(10003, "user name is null", "用户名不能为空"),
    USER_LOGIN_FAILURE(10004, "user login failure", "用户登录失败"),
    LOGIN_OUT_FAILURE(10005, "user login out failure", "用户退出失败"),
    UPDATE_PROJECT_ERROR(10046, "update project error", "更新项目信息错误"),
    QUERY_PROJECT_DETAILS_ERROR(10047, "query project details error", "查询项目信息错误"),
    CREATE_PROJECT_ERROR(10048, "create project error", "创建项目错误"),
    LOGIN_USER_QUERY_PROJECT_LIST_PAGING_ERROR(10049, "login user query project list paging error", "分页查询项目列表错误"),
    DELETE_PROJECT_ERROR(10050, "delete project error", "删除项目错误"),
    PROJECT_ALREADY_EXISTS_ERROR(10052, "project already exists error", "项目已经存在错误"),
    PROJECT_NOT_EXISTS_ERROR(10053, "project not exists error", "项目不存在错误"),
    DATASOURCE_NOT_EXISTS_ERROR(10054, "datasource not exists error", "数据源不存在错误"),
    DELETE_DATASOURCE_ERROR(10055, "delete datasource error", "删除数据源错误"),
    CREATE_DATASOURCE_ERROR(10056, "create datasource error", "创建数据源错误"),
    UPDATE_DATASOURCE_ERROR(10057, "update datasource error", "修改数据源错误"),
    QUERY_DATASOURCE_ERROR(10058, "query datasource error", "查询数据源错误"),
    DATASOURCE_ALREADY_EXISTS_ERROR(10059, "create datasource error", "数据源已经存在错误"),
    CREATE_DATASOURCE_TYPE_ERROR(10060, "create datasource type key error", "创建数据源类型错误"),
    QUERY_DATASOURCE_TYPE_ERROR(10061, "query datasource type key error", "查询数据源类型错误"),
    CREATE_DATASOURCE_TYPE_KEY_ERROR(10062, "create datasource type key error", "创建数据源键值错误"),
    DELETE_DATASOURCE_TYPE_KEY_ERROR(10063, "delete datasource type key error", "删除数据源键值错误"),
    UPDATE_DATASOURCE_TYPE_KEY_ERROR(10064, "update datasource type key error", "修改数据源键值错误"),
    QUERY_DATASOURCE_TYPE_KEY_ERROR(10065, "query datasource type key error", "查询数据源键值错误"),
    QUERY_METADATA_DB_ERROR(10066, "query metadata db error", "查询元数据数据库错误"),
    QUERY_METADATA_TABLE_ERROR(10067, "query metadata table error", "查询元数据数据库表错误"),
    QUERY_METADATA_SQL_ERROR(10068, "query metadata sql error", "查询数据SQL错误"),
    QUERY_METADATA_CONN_ERROR(10069, "query metadata conn error", "查询数据连接错误"),
    QUERY_JOB_PAGE_ERROR(10070, "query job page error", "查询场景报错"),
    CREATE_JOB_PAGE_ERROR(10071, "create job page error", "创建场景报错"),
    UPDATE_JOB_PAGE_ERROR(10072, "update job page error", "更新场景报错"),
    DELETE_JOB_PAGE_ERROR(10073, "delete job page error", "删除场景报错"),
    QUERY_JOB_ERROR(10074, "query job  error", "查询图例报错"),
    CREATE_JOB_ERROR(10075, "create job  error", "创建图例报错"),
    UPDATE_JOB_ERROR(10076, "update job  error", "更新图例报错"),
    DELETE_JOB_ERROR(10077, "delete job  error", "删除图例报错"),
    JOB_PAGE_ALREADY_EXISTS_ERROR(10078, "job page already exists error", "场景存在报错"),
    FAILED(1, "failed", "失败");

    private final int code;
    private final String enMsg;
    private final String zhMsg;

    Status(int code, String enMsg, String zhMsg) {
        this.code = code;
        this.enMsg = enMsg;
        this.zhMsg = zhMsg;
    }

    public int getCode() {
        return this.code;
    }

    public String getMsg() {
        if (Locale.SIMPLIFIED_CHINESE.getLanguage().equals(LocaleContextHolder.getLocale().getLanguage())) {
            return this.zhMsg;
        } else {
            return this.enMsg;
        }
    }


}
