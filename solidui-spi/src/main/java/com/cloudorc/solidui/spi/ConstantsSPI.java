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


package com.cloudorc.solidui.spi;

public class ConstantsSPI {

    public static final String PARAM_SQL_HOST ="host";

    public static final String PARAM_SQL_PORT ="port";

    public static final String PARAM_SQL_USERNAME = "username";

    public static final String PARAM_SQL_PASSWORD = "password";

    public static final String PARAM_SQL_EXTRA_PARAMS = "params";

    public static final String PARAM_SQL_DATABASE = "database";

    public static final String PARAM_SQL_DRIVERCLASSNAME = "driverClassName";

    public static final String DATASOURCE_CLASSNAME = "com.cloudorc.solidui.plugin.jdbc.%sClientFactory";

    public static final String DATASOURCE_TYPE_LIST = "mysql,doris";


}
