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

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.dao.mapper.DataSourceMapper;
import com.cloudorc.solidui.dao.mapper.DataSourceTypeMapper;
import com.cloudorc.solidui.entrance.dto.DataSourceDTO;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.exceptions.ServiceException;
import com.cloudorc.solidui.entrance.service.DataSourceService;
import com.cloudorc.solidui.entrance.utils.DataSourceUtils;
import com.cloudorc.solidui.entrance.utils.PageInfo;
import com.cloudorc.solidui.entrance.utils.Result;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * data source service impl
 */
@Service
public class DataSourceServiceImpl extends BaseServiceImpl implements DataSourceService {
    private final Logger logger = LoggerFactory.getLogger(DataSourceServiceImpl.class);

    @Autowired
    private DataSourceMapper dataSourceMapper;

    @Autowired
    private DataSourceTypeMapper dataSourceTypeMapper;


    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result createDataSource(DataSource dataSource) throws ServiceException {
         Result<Object> result = new Result<>();
        DataSource newDataSource = dataSourceMapper.queryByName(dataSource.getDataSourceName(),null);
        if(newDataSource != null){
            putMsg(result, Status.DATASOURCE_ALREADY_EXISTS_ERROR);
            return result;
        }

        if(dataSourceMapper.insertOne(dataSource) > 0){
            putMsg(result, Status.SUCCESS);
        }else{
            putMsg(result, Status.CREATE_DATASOURCE_ERROR);
        }
        return result;
    }

    @Override
    public Result queryDataSource(Long dataSourceId) {
        Result<Object> result = new Result<>();
        if(dataSourceId == null) {
            putMsg(result, Status.QUERY_DATASOURCE_ERROR);
            return result;
        }

        DataSource dataSource = dataSourceMapper.queryByName(null,dataSourceId);
        if(dataSource == null) {
            putMsg(result, Status.QUERY_DATASOURCE_ERROR);
        }else{
            DataSourceDTO dataSourceDTO = new DataSourceDTO();
            BeanUtils.copyProperties(dataSource, dataSourceDTO);
            putMsg(result, Status.SUCCESS);
            result.setData(dataSource);
        }
        return result;
    }

    @Override
    public Result queryDataSource(String dataSourceName) {
        Result<Object> result = new Result<>();
        if(StringUtils.isBlank(dataSourceName)){
            putMsg(result, Status.QUERY_DATASOURCE_ERROR);
            return result;
        }

        DataSource dataSource = dataSourceMapper.queryByName(dataSourceName,null);
        if(dataSource == null) {
            putMsg(result, Status.QUERY_DATASOURCE_ERROR);
        }else{
            DataSourceDTO dataSourceDTO = new DataSourceDTO();
            BeanUtils.copyProperties(dataSource, dataSourceDTO);
            putMsg(result, Status.SUCCESS);
            result.setData(dataSourceDTO);
        }
        return result;
    }

    @Override
    public Result existDataSource(Long dataSourceId) {
        Result<Object> result = new Result<>();
        if(dataSourceId == null){
            putMsg(result, Status.DATASOURCE_NOT_EXISTS_ERROR);
            return result;
        }

        DataSource dataSource = dataSourceMapper.selectById(dataSourceId);
        if(dataSource == null) {
            putMsg(result, Status.DATASOURCE_NOT_EXISTS_ERROR);
        }else{
            int affect = dataSourceMapper.expireOne(dataSource.getId());
            if (affect > 0) {
                putMsg(result, Status.SUCCESS);
                result.setData(dataSource.getId());
            } else {
                putMsg(result, Status.DATASOURCE_NOT_EXISTS_ERROR);
            }
        }
        return result;
    }

    @Override
    public Result queryDataSourceByPage(String dataSourceName, Long dataSourceTypeId, Integer pageNo, Integer pageSize) {
        Result<Object> result = new Result<>();
        PageInfo<DataSource> pageInfo = new PageInfo<>(pageNo, pageSize);
        Page<DataSource> page = new Page<>(pageNo, pageSize);
        IPage<DataSource> dataSourceIPage = dataSourceMapper.queryDataSourceByPage(page, dataSourceName, dataSourceTypeId);
        List<DataSource> dataSourceList = dataSourceIPage.getRecords();
        pageInfo.setTotal((int) dataSourceIPage.getTotal());
        pageInfo.setTotalList(dataSourceList);
        result.setData(pageInfo);
        putMsg(result, Status.SUCCESS);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result deleteDataSource(Long dataSourceId) {
        Result<Object> result = new Result<>();
        if(dataSourceId == null) {
            putMsg(result, Status.DELETE_DATASOURCE_ERROR);
        }
        if(dataSourceMapper.deleteById(dataSourceId) > 0) {
            putMsg(result, Status.SUCCESS);
        }else{
            putMsg(result, Status.DELETE_DATASOURCE_ERROR);
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result updateDataSource(DataSource dataSource) {
        Result<Object> result = new Result<>();
        DataSource newDataSource = dataSourceMapper.queryByName(null,dataSource.getId());
        if(newDataSource == null) {
            putMsg(result,Status.UPDATE_DATASOURCE_ERROR);
            return result;
        }
        if(dataSourceMapper.updateOne(dataSource) > 0) {
            putMsg(result, Status.SUCCESS);
        }else{
            putMsg(result, Status.UPDATE_DATASOURCE_ERROR);
        }
        return result;
    }


}
