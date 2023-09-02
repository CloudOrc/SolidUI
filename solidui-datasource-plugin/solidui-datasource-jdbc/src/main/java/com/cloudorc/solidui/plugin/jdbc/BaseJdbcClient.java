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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public abstract class BaseJdbcClient implements JdbcClient {

    public final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final Connection conn;

    public BaseJdbcClient(Connection conn) {
        this.conn = conn;
    }

    public void closeResource(Connection connection, Statement statement, ResultSet resultSet) {
        try {
            if (null != resultSet && !resultSet.isClosed()) {
                resultSet.close();
            }
            if (null != statement && !statement.isClosed()) {
                statement.close();
            }
            if (null != connection && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            logger.warn("Fail to release resource [" + e.getMessage() + "]", e);
        }
    }

    @Override
    public void close() throws IOException {
        closeResource(conn, null, null);
    }

    @Override
    public Connection getConn() {
        return conn;
    }
}
