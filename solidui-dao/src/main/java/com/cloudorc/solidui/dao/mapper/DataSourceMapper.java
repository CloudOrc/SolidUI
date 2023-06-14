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

package com.cloudorc.solidui.dao.mapper;

import com.cloudorc.solidui.dao.entity.DataSource;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;

public interface DataSourceMapper extends BaseMapper<DataSource> {

    DataSource queryByName(@Param("dataSourceName") String dataSourceName, @Param("id") Long id);

    int expireOne(@Param("dataSourceId") Long dataSourceId);

    IPage<DataSource> queryDataSourceByPage(IPage<DataSource> page,
                                            @Param("dataSourceName") String dataSourceName,
                                            @Param("dataSourceTypeId") Long dataSourceTypeId,
                                            @Param("expire") Boolean expire);

    int updateOne(DataSource dataSource);

    int insertOne(DataSource dataSource);
}
