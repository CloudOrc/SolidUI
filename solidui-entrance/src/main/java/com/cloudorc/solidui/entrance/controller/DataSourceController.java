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
package com.cloudorc.solidui.entrance.controller;


import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.dao.entity.DataSourceParamKey;
import com.cloudorc.solidui.dao.entity.DataSourceType;
import com.cloudorc.solidui.dao.entity.DataSourceInfo;
import com.cloudorc.solidui.entrance.service.DataSourceService;
import com.cloudorc.solidui.entrance.service.DataSourceTypeService;
import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.*;

/**
 * data source controller
 */
@Api(tags = "DATASOURCE_TAG")
@RestController
@RequestMapping("datasource")
public class DataSourceController extends BaseController {
    @Autowired
    private DataSourceService dataSourceService;
    @Autowired
    private DataSourceTypeService dataSourceTypeService;

    @ApiOperation(value = "queryAllDataSourceTypes", notes = "get all data source types")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/type/all", method = RequestMethod.GET)
    public Result getAllDataSourceTypes() {

        return dataSourceTypeService.queryAllDataSourceTypes();
    }

    @ApiOperation(value = "queryKeyByType", notes = "get key definitions by type")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "typeId", required = true, dataType = "Long", value = "type id")
    })
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/key/type/{typeId}", method = RequestMethod.GET)
    public Result getKeyByType(
            @PathVariable("typeId") Long dataSourceTypeId, HttpServletRequest req) {
        return dataSourceTypeService.queryKeyByType(dataSourceTypeId);
    }

    @ApiOperation(value = "insertJsonInfo", notes = "insert json info")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "createSystem", example = "Linkis", required = true, dataType = "String", value = "create system"),
            @ApiImplicitParam(name = "dataSourceDesc", required = true, dataType = "String", value = "data source desc"),
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "dataSourceTypeId", required = true, dataType = "String", value = "data source type id"),
            @ApiImplicitParam(name = "labels", required = true, dataType = "String", value = "labels"),
            @ApiImplicitParam(name = "connectParams", required = true, dataType = "List", value = "connect params"),
            @ApiImplicitParam(name = "host", example = "10.107.93.146", required = false, dataType = "String", value = "host"),
            @ApiImplicitParam(name = "password", required = false, dataType = "String", value = "password"),
            @ApiImplicitParam(name = "port", required = false, dataType = "String", value = "port", example = "9523"),
            @ApiImplicitParam(name = "subSystem", required = false, dataType = "String", value = "sub system"),
            @ApiImplicitParam(name = "username", required = false, dataType = "String", value = "user name")
    })
    @RequestMapping(value = "/info/json", method = RequestMethod.POST)
    public Result insertJsonInfo(@RequestBody DataSource dataSource, HttpServletRequest req) {
        Long id = dataSource.getId();
        return success(id);

    }

    @ApiOperation(value = "updateDataSourceInJson", notes = "update data source in json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id"),
            @ApiImplicitParam(name = "createSystem", required = true, dataType = "String", value = "create system", example = "Linkis"),
            @ApiImplicitParam(name = "createTime", required = true, dataType = "String", value = "create time", example = "1650426189000"),
            @ApiImplicitParam(name = "createUser", required = true, dataType = "String", value = "create user", example = "johnnwang"),
            @ApiImplicitParam(name = "dataSourceDesc", required = true, dataType = "String", value = "data source desc"),
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "dataSourceTypeId", required = true, dataType = "String", value = "data source type id"),
            @ApiImplicitParam(name = "labels", required = true, dataType = "String", value = "labels"),
            @ApiImplicitParam(name = "connectParams", required = true, dataType = "List", value = "connect params"),
            @ApiImplicitParam(name = "host", required = false, dataType = "String", value = "host", example = "10.107.93.146"),
            @ApiImplicitParam(name = "password", required = false, dataType = "String", value = "password"),
            @ApiImplicitParam(name = "port", required = false, dataType = "String", value = "port", example = "9523"),
            @ApiImplicitParam(name = "subSystem", required = false, dataType = "String", value = "sub system"),
            @ApiImplicitParam(name = "username", required = false, dataType = "String", value = "user name"),
            @ApiImplicitParam(name = "expire", required = false, dataType = "boolean", value = "expire", example = "false"),
            @ApiImplicitParam(name = "file", required = false, dataType = "String", value = "file", example = "adn"),
            @ApiImplicitParam(name = "modifyTime", required = false, dataType = "String", value = "modify time", example = "1657611440000"),
            @ApiImplicitParam(name = "modifyUser", required = false, dataType = "String", value = "modify user", example = "johnnwang"),
            @ApiImplicitParam(name = "versionId", required = false, dataType = "String", value = "versionId", example = "18")
    })
    @RequestMapping(value = "/info/{dataSourceId}/json", method = RequestMethod.PUT)
    public Result updateDataSourceInJson(
            @RequestBody DataSource dataSource,
            @PathVariable("dataSourceId") Long dataSourceId,
            HttpServletRequest req) {
        return success(dataSourceId);
    }



    /**
     * get datasource detail, for current version
     *
     * @param dataSourceId
     * @param request
     * @return
     */
    @ApiOperation(value = "getInfoByDataSourceId", notes = "get info by data source id")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/info/{dataSourceId}", method = RequestMethod.GET)
    public Result getInfoByDataSourceId(
            @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest request) {
        DataSource dataSource = new DataSource();
        dataSource.setDataSourceName("test");
        dataSource.setDataSourceDesc("test");
        dataSource.setDataSourceTypeId(1L);
        dataSource.setLabels("test");
        dataSource.setConnectParams(new HashMap<>());
        return success(dataSource);
    }

    @ApiOperation(value = "getInfoByDataSourceName", notes = "get info by data source name")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name")
    })
    @RequestMapping(value = "/info/name/{dataSourceName}", method = RequestMethod.GET)
    public Result getInfoByDataSourceName(
            @PathVariable("dataSourceName") String dataSourceName, HttpServletRequest request)
            throws UnsupportedEncodingException {
        DataSource dataSource = new DataSource();
        dataSource.setDataSourceName("test");
        dataSource.setDataSourceDesc("test");
        dataSource.setDataSourceTypeId(1L);
        dataSource.setLabels("test");
        dataSource.setConnectParams(new HashMap<>());
        return success(dataSource);

    }

    /**
     * Dangerous operation!
     *
     * @param dataSourceId
     * @return
     */
    @ApiOperation(value = "removeDataSource", notes = "remove data source")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/info/delete/{dataSourceId}", method = RequestMethod.DELETE)
    public Result removeDataSource(
            @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest request) {
        Long removeId = 1L;
        return success(removeId);
    }

    @ApiOperation(value = "expireDataSource", notes = "expire data source")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/info/{dataSourceId}/expire", method = RequestMethod.PUT)
    public Result expireDataSource(
            @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest request) {
        Long expireId = 1L;
        return success(expireId);

    }


    @ApiOperation(value = "queryDataSource", notes = "query data source")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "system", required = false, dataType = "String", value = "system"),
            @ApiImplicitParam(name = "name", required = false, dataType = "Long", value = "name"),
            @ApiImplicitParam(name = "typeId", required = false, dataType = "Long", value = "type id"),
            @ApiImplicitParam(name = "identifies", required = false, dataType = "String", value = "identifies"),
            @ApiImplicitParam(name = "currentPage", required = false, dataType = "Integer", value = "current page"),
            @ApiImplicitParam(name = "pageSize", required = false, dataType = "Integer", value = "page size")
    })
    @RequestMapping(value = "/info", method = RequestMethod.GET)
    public Result queryDataSource(
            @RequestParam(value = "system", required = false) String createSystem,
            @RequestParam(value = "name", required = false) String dataSourceName,
            @RequestParam(value = "typeId", required = false) Long dataSourceTypeId,
            @RequestParam(value = "identifies", required = false) String identifies,
            @RequestParam(value = "currentPage", required = false) Integer currentPage,
            @RequestParam(value = "pageSize", required = false) Integer pageSize,
            HttpServletRequest req) {
        List<DataSource> dataSources = new ArrayList<>();
        DataSource dataSource = new DataSource();
        dataSource.setDataSourceName("test");
        dataSources.add(dataSource);
        Result<Object> result = new Result<>();
        result.setData(dataSources);
        return result;
    }


    @ApiOperation(value = "connect", notes = "connect")

    @RequestMapping(value = "/connect/json", method = RequestMethod.POST)
    public Result connect(@RequestBody DataSource dataSource, HttpServletRequest request) {
        return success(true);
    }


}
