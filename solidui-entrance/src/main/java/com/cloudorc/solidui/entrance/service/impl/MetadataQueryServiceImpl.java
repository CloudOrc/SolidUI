package com.cloudorc.solidui.entrance.service.impl;

import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.dao.mapper.DataSourceMapper;
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
        DataSource dataSource = dataSourceMapper.queryByName(dataSourceName,null);
        Result<Object> result = new Result<>();
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
    public Result queryConnection(String dataSourceName, String typeName) {
        DataSource dataSource = dataSourceMapper.queryByName(dataSourceName,null);
        Result<Object> result = new Result<>();
        if(dataSource == null) {
            putMsg(result, Status.QUERY_METADATA_DB_ERROR);
            return result;
        }

        try {
            JdbcClient jdbcClient = DataSourceUtils.queryJdbcClient(typeName, dataSource);
            if(jdbcClient != null)  {
                Connection conn = jdbcClient.getConn();
                if(conn == null){
                    putMsg(result, Status.QUERY_METADATA_DB_ERROR);
                }else{
                    putMsg(result, Status.SUCCESS);
                }
            } else {
                putMsg(result, Status.QUERY_METADATA_DB_ERROR);
            }

        } catch (Exception e) {
            logger.error("queryConnection error", e);
            putMsg(result, Status.QUERY_METADATA_DB_ERROR);
        }

        return result;
    }
}
