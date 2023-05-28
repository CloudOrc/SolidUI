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

package com.cloudorc.solidui.entrance.service.impl;

import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.dao.entity.DataSourceType;
import com.cloudorc.solidui.dao.mapper.DataSourceMapper;
import com.cloudorc.solidui.dao.mapper.DataSourceTypeMapper;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.service.MetadataQueryService;
import com.cloudorc.solidui.entrance.utils.DataSourceUtils;
import com.cloudorc.solidui.entrance.utils.Result;
import com.cloudorc.solidui.plugin.jdbc.JdbcClient;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.util.List;

@Service
public class MetadataQueryServiceImpl extends BaseServiceImpl implements MetadataQueryService {
    private final Logger logger = LoggerFactory.getLogger(MetadataQueryServiceImpl.class);
    @Autowired
    private DataSourceMapper dataSourceMapper;
    @Autowired
    private DataSourceTypeMapper dataSourceTypeMapper;

    @Override
    public Result queryDatabasesByDsName(String dataSourceName, String typeName) {
        DataSource dataSource = dataSourceMapper.queryByName(dataSourceName,null);
        Result<Object> result = new Result<>();
        if(dataSource == null) {
            putMsg(result, Status.QUERY_METADATA_DB_ERROR);
            return result;
        }

        try {
            JdbcClient jdbcClient = DataSourceUtils.queryJdbcClient(typeName, dataSource);
            if(jdbcClient != null)  {
                List<String> allDatabase = jdbcClient.getAllDatabase();
                if(CollectionUtils.isEmpty(allDatabase)){
                    putMsg(result, Status.QUERY_METADATA_DB_ERROR);
                }else{
                    putMsg(result, Status.SUCCESS);
                    result.setData(allDatabase);
                }
            } else {
                putMsg(result, Status.QUERY_METADATA_DB_ERROR);
            }

        } catch (Exception e) {
            logger.error("queryDatabasesByDsName error", e);
            putMsg(result, Status.QUERY_METADATA_DB_ERROR);
        }

        return result;
    }

    @Override
    public Result queryTablesByDsName(String dataSourceName, String dbName, String typeName) {
        DataSource dataSource = dataSourceMapper.queryByName(dataSourceName,null);
        Result<Object> result = new Result<>();
        if(dataSource == null) {
            putMsg(result, Status.QUERY_METADATA_TABLE_ERROR);
            return result;
        }

        try {
            JdbcClient jdbcClient = DataSourceUtils.queryJdbcClient(typeName, dataSource);
            if(jdbcClient != null)  {
                List<String> allTables = jdbcClient.getAllTables(dbName);
                if(CollectionUtils.isEmpty(allTables)){
                    putMsg(result, Status.QUERY_METADATA_TABLE_ERROR);
                }else{
                    putMsg(result, Status.SUCCESS);
                    result.setData(allTables);
                }
            } else {
                putMsg(result, Status.QUERY_METADATA_TABLE_ERROR);
            }

        } catch (Exception e) {
            logger.error("queryTablesByDsName error", e);
            putMsg(result, Status.QUERY_METADATA_TABLE_ERROR);
        }

        return result;
    }

    @Override
    public Result queryBySql(String dataSourceName, String sql, String typeName) {
        Result<Object> result = new Result<>();
        if(dataSourceName == null || typeName == null){
            putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
            return result;
        }

        DataSource dataSource = dataSourceMapper.queryByName(dataSourceName,null);

        if(dataSource == null) {
            putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
            return result;
        }

        try {
            JdbcClient jdbcClient = DataSourceUtils.queryJdbcClient(typeName, dataSource);
            if(jdbcClient != null)  {
                List<List<String>> selectResult = jdbcClient.getSelectResult(sql);
                if(CollectionUtils.isEmpty(selectResult)){
                    putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
                }else{
                    putMsg(result, Status.SUCCESS);
                    result.setData(selectResult);
                }
            } else {
                putMsg(result, Status.DATASOURCE_NOT_EXISTS_ERROR);
            }

        } catch (Exception e) {
            logger.error("queryBySql error", e);
            putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
        }

        return result;
    }

    @Override
    public Result queryBySql(Long dataSourceId, String sql, Long typeId) {
        Result<Object> result = new Result<>();
        if(dataSourceId == null || typeId == null){
            putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
            return result;
        }

        DataSource dataSource = dataSourceMapper.queryByName(null,dataSourceId);

        if(dataSource == null) {
            putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
            return result;
        }
        DataSourceType dataSourceType = dataSourceTypeMapper.selectById(typeId);
        if(dataSourceType == null){
            putMsg(result, Status.QUERY_DATASOURCE_ERROR);
            return result;
        }
        try {
            JdbcClient jdbcClient = DataSourceUtils.queryJdbcClient(dataSourceType.getName(), dataSource);
            if(jdbcClient != null)  {
                List<List<String>> selectResult = jdbcClient.getSelectResult(sql);
                if(CollectionUtils.isEmpty(selectResult)){
                    putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
                }else{
                    putMsg(result, Status.SUCCESS);
                    result.setData(selectResult);
                }
            } else {
                putMsg(result, Status.DATASOURCE_NOT_EXISTS_ERROR);
            }

        } catch (Exception e) {
            logger.error("queryBySql error", e);
            putMsg(result, Status.QUERY_METADATA_SQL_ERROR);
        }

        return result;
    }

    @Override
    public Result queryConnection(String dataSourceName, String typeName) {
        DataSource dataSource = dataSourceMapper.queryByName(dataSourceName,null);
        Result<Object> result = new Result<>();
        if(dataSource == null) {
            putMsg(result, Status.QUERY_METADATA_CONN_ERROR);
            return result;
        }

        try {
            JdbcClient jdbcClient = DataSourceUtils.queryJdbcClient(typeName, dataSource);
            if(jdbcClient != null)  {
                Connection conn = jdbcClient.getConn();
                if(conn == null){
                    putMsg(result, Status.QUERY_METADATA_CONN_ERROR);
                }else{
                    putMsg(result, Status.SUCCESS);
                }
            } else {
                putMsg(result, Status.QUERY_METADATA_CONN_ERROR);
            }

        } catch (Exception e) {
            logger.error("queryConnection error", e);
            putMsg(result, Status.QUERY_METADATA_CONN_ERROR);
        }

        return result;
    }
}
