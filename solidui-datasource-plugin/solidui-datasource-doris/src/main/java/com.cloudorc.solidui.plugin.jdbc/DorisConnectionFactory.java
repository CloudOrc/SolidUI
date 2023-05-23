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

package com.cloudorc.solidui.plugin.jdbc;

import com.cloudorc.solidui.plugin.jdbc.connector.ConnectionFactory;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Map;
import java.util.stream.Collectors;

public class DorisConnectionFactory implements ConnectionFactory {

    public static final String SQL_DRIVER_CLASS = "com.mysql.jdbc.Driver";

    public static final String SQL_CONNECT_URL = "jdbc:mysql://%s:%s/%s";

    @Override
    public Connection openConnection(String host, Integer port, String username, String password, String database, Map<String, Object> extraParams) throws ClassNotFoundException, SQLException {
        String extraParamString = extraParams.entrySet().stream()
                        .map(e -> String.join("=", e.getKey(), String.valueOf(e.getValue())))
                        .collect(Collectors.joining("&"));
        Class.forName(SQL_DRIVER_CLASS);
        String url =
                String.format(
                        SQL_CONNECT_URL,
                        host,
                        port,
                        database);
        if (!extraParams.isEmpty()) {
            url += "?" + extraParamString;
        }
        return DriverManager.getConnection(url, username, password);
    }

    @Override
    public String getName() {
        return "mysql";
    }
}
