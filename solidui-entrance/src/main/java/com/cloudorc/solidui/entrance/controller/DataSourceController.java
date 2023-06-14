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

import static com.cloudorc.solidui.entrance.enums.Status.*;

import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.entrance.constants.Constants;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.service.DataSourceService;
import com.cloudorc.solidui.entrance.service.DataSourceTypeService;
import com.cloudorc.solidui.entrance.service.MetadataQueryService;
import com.cloudorc.solidui.entrance.utils.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * data source controller
 */
@Api(tags = "datasource_tag")
@RestController
@RequestMapping("datasource")
public class DataSourceController extends BaseController {

    @Autowired
    private DataSourceService dataSourceService;
    @Autowired
    private DataSourceTypeService dataSourceTypeService;
    @Autowired
    private MetadataQueryService metadataQueryService;

    @ApiOperation(value = "queryAllDataSourceTypes", notes = "get all data source types")
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_DATASOURCE_TYPE_ERROR)
    @RequestMapping(value = "/type/all", method = RequestMethod.GET)
    public Result getAllDataSourceTypes() {

        return dataSourceTypeService.queryAllDataSourceTypes();
    }

    @ApiOperation(value = "queryKeyByType", notes = "get key definitions by type")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "typeId", required = true, dataType = "Long", value = "type id")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_DATASOURCE_TYPE_KEY_ERROR)
    @RequestMapping(value = "/key/type/{typeId}", method = RequestMethod.GET)
    public Result getKeyByType(
                               @PathVariable("typeId") Long dataSourceTypeId, HttpServletRequest req) {
        return dataSourceTypeService.queryKeyByType(dataSourceTypeId);
    }

    @ApiOperation(value = "insertJsonInfo", notes = "insert json info")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceDesc", required = true, dataType = "String", value = "data source desc"),
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "dataSourceTypeId", required = true, dataType = "String", value = "data source type id"),
            @ApiImplicitParam(name = "labels", required = true, dataType = "String", value = "labels"),
            @ApiImplicitParam(name = "connectParams", required = true, dataType = "List", value = "connect params"),
            @ApiImplicitParam(name = "host", example = "127.0.0.1", required = false, dataType = "String", value = "host"),
            @ApiImplicitParam(name = "password", required = false, dataType = "String", value = "password"),
            @ApiImplicitParam(name = "port", required = false, dataType = "String", value = "port", example = "12345"),
            @ApiImplicitParam(name = "username", required = false, dataType = "String", value = "user name")
    })
    @ResponseStatus(HttpStatus.CREATED)
    @ApiException(CREATE_DATASOURCE_ERROR)
    @RequestMapping(value = "/info/json", method = RequestMethod.POST)
    public Result insertJsonInfo(@RequestBody DataSource dataSource, HttpServletRequest req) {
        Result<Object> result = new Result<>();
        String dataSourceName = dataSource.getDataSourceName();
        if (StringUtils.isBlank(dataSourceName)) {
            return error(Status.CREATE_DATASOURCE_ERROR.getCode(),
                    Status.CREATE_PROJECT_ERROR.getMsg());
        }
        Long dataSourceTypeId = dataSource.getDataSourceTypeId();
        String parameter = dataSource.getParameter();
        if (dataSourceTypeId == null) {
            return error(Status.CREATE_DATASOURCE_ERROR.getCode(),
                    Status.CREATE_PROJECT_ERROR.getMsg());
        }
        if (StringUtils.isBlank(parameter)) {
            return error(Status.CREATE_DATASOURCE_ERROR.getCode(),
                    Status.CREATE_PROJECT_ERROR.getMsg());
        }

        return dataSourceService.createDataSource(dataSource);

    }

    @ApiOperation(value = "updateDataSourceJson", notes = "update data source in json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id"),
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
            @ApiImplicitParam(name = "username", required = false, dataType = "String", value = "user name"),
            @ApiImplicitParam(name = "expire", required = false, dataType = "boolean", value = "expire", example = "false")
    })
    @ApiException(UPDATE_DATASOURCE_ERROR)
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/info/{dataSourceId}/json", method = RequestMethod.PUT)
    public Result updateDataSourceInJson(
                                         @RequestBody DataSource dataSource,
                                         @PathVariable("dataSourceId") Long dataSourceId,
                                         HttpServletRequest req) {
        dataSource.setId(dataSourceId);
        return dataSourceService.updateDataSource(dataSource);
    }

    /**
     * get datasource detail, for current version
     *
     * @param dataSourceId
     * @param request
     * @return
     */
    @ApiOperation(value = "queryByDataSourceId", notes = "get info by data source id")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/info/{dataSourceId}", method = RequestMethod.GET)
    @ApiException(QUERY_DATASOURCE_ERROR)
    @ResponseStatus(HttpStatus.OK)
    public Result getInfoByDataSourceId(
                                        @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest request) {

        return dataSourceService.queryDataSource(dataSourceId);
    }

    @ApiOperation(value = "queryByDataSourceName", notes = "get info by data source name")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name")
    })
    @RequestMapping(value = "/info/name/{dataSourceName}", method = RequestMethod.GET)
    @ApiException(QUERY_DATASOURCE_ERROR)
    @ResponseStatus(HttpStatus.OK)
    public Result getInfoByDataSourceName(
                                          @PathVariable("dataSourceName") String dataSourceName,
                                          HttpServletRequest request) throws UnsupportedEncodingException {

        return dataSourceService.queryDataSource(dataSourceName);
    }

    /**
     * Dangerous operation!
     *
     * @param dataSourceId
     * @return
     */
    @ApiOperation(value = "deleteDataSource", notes = "remove data source")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/info/delete/{dataSourceId}", method = RequestMethod.DELETE)
    @ApiException(DELETE_DATASOURCE_ERROR)
    @ResponseStatus(HttpStatus.OK)
    public Result removeDataSource(
                                   @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest request) {

        return dataSourceService.deleteDataSource(dataSourceId);
    }

    @ApiOperation(value = "expireDataSource", notes = "expire data source")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/info/{dataSourceId}/expire", method = RequestMethod.PUT)
    @ApiException(UPDATE_DATASOURCE_ERROR)
    @ResponseStatus(HttpStatus.OK)
    public Result expireDataSource(
                                   @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest request) {

        return dataSourceService.existDataSource(dataSourceId);
    }

    @ApiOperation(value = "queryDataSource", notes = "query data source")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "name", required = false, dataType = "Long", value = "name"),
            @ApiImplicitParam(name = "typeId", required = false, dataType = "Long", value = "type_id"),
            @ApiImplicitParam(name = "expire", required = false, dataType = "Boolean", value = "expire"),
            @ApiImplicitParam(name = "pageSize", value = "PAGE_SIZE", required = true, dataTypeClass = int.class, example = "10"),
            @ApiImplicitParam(name = "pageNo", value = "PAGE_NO", required = true, dataTypeClass = int.class, example = "1")
    })
    @RequestMapping(value = "/info", method = RequestMethod.GET)
    @ApiException(QUERY_DATASOURCE_ERROR)
    @ResponseStatus(HttpStatus.OK)
    public Result queryDataSource(
                                  @RequestParam(value = "name", required = false) String dataSourceName,
                                  @RequestParam(value = "typeId", required = false) Long dataSourceTypeId,
                                  @RequestParam(value = "expire", required = false) Boolean expire,
                                  @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                  @RequestParam(value = "pageNo", required = false) Integer pageNo,
                                  HttpServletRequest req) {
        if (pageSize == null || pageSize <= 0) {
            pageSize = Constants.DEFAULT_PAGE_SIZE;
        }
        if (pageNo == null || pageNo <= 0) {
            pageNo = Constants.DEFAULT_PAGE_NO;
        }

        return dataSourceService.queryDataSourceByPage(dataSourceName, dataSourceTypeId, expire, pageNo, pageSize);
    }

    @ApiOperation(value = "connect", notes = "connect")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = false, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "typeName", required = false, dataType = "String", value = "type name")
    })
    @RequestMapping(value = "/connect/json", method = RequestMethod.POST)
    @ApiException(QUERY_DATASOURCE_ERROR)
    @ResponseStatus(HttpStatus.OK)
    public Result connect(@RequestParam(value = "dataSourceName", required = true) String dataSourceName,
                          @RequestParam(value = "typeName", required = true) String typeName,
                          HttpServletRequest request) {
        return metadataQueryService.queryConnection(dataSourceName, typeName);
    }

}
