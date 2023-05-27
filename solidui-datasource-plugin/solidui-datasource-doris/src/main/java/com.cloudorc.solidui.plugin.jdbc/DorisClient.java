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

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DorisClient extends BaseJdbcClient {

    public DorisClient(Connection conn) {
        super(conn);
    }

    @Override
    public List<String> getAllDatabase() throws SQLException{
        List<String> dataBaseName = new ArrayList<>();
        Statement stmt = null;
        ResultSet rs = null;
        try {

            stmt = getConn().createStatement();
            rs = stmt.executeQuery("SHOW DATABASES");
            while (rs.next()) {
                dataBaseName.add(rs.getString(1));
            }
        } finally {
            closeResource(null, stmt, rs);
        }
        return dataBaseName;
    }

    @Override
    public List<String> getAllTables(String database) throws SQLException{
        List<String> tableNames = new ArrayList<>();
        Statement stmt = null;
        ResultSet rs = null;
        try {
            stmt = getConn().createStatement();
            rs = stmt.executeQuery("SHOW TABLES FROM `" + database + "`");
            while (rs.next()) {
                tableNames.add(rs.getString(1));
            }
            return tableNames;
        } finally {
            closeResource(null, stmt, rs);
        }
    }

    @Override
    public List<List<String>> getSelectResult(String sql) throws SQLException{
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<List<String>> lists = new ArrayList<>();
        try {
            pstmt = getConn().prepareStatement(sql);
            rs = pstmt.executeQuery();
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            //获取列名
            List<String> columnName = new ArrayList<>();
            for (int i = 1; i < columnCount + 1; i++) {
                columnName.add(metaData.getColumnName(i));
            }
            lists.add(columnName);

            while (rs.next()) {
                List<String> stringArrayList = new ArrayList<>();
                for (int i = 1; i < columnCount + 1; i++) {
                    stringArrayList.add(rs.getString(i).trim());
                }
                lists.add(stringArrayList);
            }
            return lists;
        } finally {
            closeResource(null, pstmt, rs);
        }
    }
}
