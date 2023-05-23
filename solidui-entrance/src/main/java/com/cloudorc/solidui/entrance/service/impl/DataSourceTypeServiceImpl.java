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

import com.cloudorc.solidui.dao.entity.DataSourceTypeKey;
import com.cloudorc.solidui.dao.entity.DataSourceType;
import com.cloudorc.solidui.dao.mapper.DataSourceParamKeyMapper;
import com.cloudorc.solidui.dao.mapper.DataSourceTypeMapper;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.service.DataSourceTypeService;
import com.cloudorc.solidui.entrance.utils.Result;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * data source type service impl
 */
@Service
public class DataSourceTypeServiceImpl extends BaseServiceImpl implements DataSourceTypeService {
    @Autowired
    private DataSourceTypeMapper dataSourceTypeMapper;
    @Autowired
    private DataSourceParamKeyMapper dataSourceParamKeyMapper;

    @Override
    public Result queryAllDataSourceTypes() {
        Result result = new Result<>();
        List<DataSourceType> dataSourceTypes = dataSourceTypeMapper.queryAllTypes();
        if(CollectionUtils.isEmpty(dataSourceTypes)){
            putMsg(result, Status.QUERY_DATASOURCE_TYPE_ERROR);
        }else{
            putMsg(result, Status.SUCCESS);
            result.setData(dataSourceTypes);
        }
        return result;
    }

    @Override
    public Result queryDataSourceType(Long typeId) {
        Result result = new Result<>();
        DataSourceType dataSourceType = dataSourceTypeMapper.selectById(typeId);
        if(dataSourceType == null){
            putMsg(result, Status.QUERY_DATASOURCE_TYPE_ERROR);
        }else{
            putMsg(result, Status.SUCCESS);
            result.setData(dataSourceType);
        }
        return result;
    }

    @Override
    public Result queryKeyByType(Long dataSourceTypeId) {
        Result result = new Result<>();
        List<DataSourceTypeKey> dataSourceTypeKey = dataSourceParamKeyMapper.queryByDataSourceTypeId(dataSourceTypeId);
        if(CollectionUtils.isEmpty(dataSourceTypeKey)){
            putMsg(result, Status.QUERY_DATASOURCE_TYPE_KEY_ERROR);
        }else{
            putMsg(result, Status.SUCCESS);
            result.setData(dataSourceTypeKey);
        }
        return result;
    }
}
