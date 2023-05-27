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

import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.service.MetadataQueryService;
import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

import static com.cloudorc.solidui.entrance.enums.Status.*;

@Api(tags = "metadata_query")
@RestController
@RequestMapping("metadataQuery")
public class MetadataQueryController extends BaseController {

    @Autowired
    private MetadataQueryService metadataQueryService;

    @ApiOperation(value = "queryDatabases", notes = "query databases")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "typeName", required = true, dataType = "String", value = "typeName")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_METADATA_DB_ERROR)
    @RequestMapping(value = "/queryDatabases", method = RequestMethod.GET)
    public Result getDatabases(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("typeName") String typeName,
            HttpServletRequest request) {
        return metadataQueryService.queryDatabasesByDsName(dataSourceName,typeName);

    }

    @ApiOperation(value = "queryTables", notes = "query tables")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "typeName", required = true, dataType = "String", value = "typeName"),
            @ApiImplicitParam(name = "database", required = true, dataType = "String", value = "database")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_METADATA_TABLE_ERROR)
    @RequestMapping(value = "/queryTables", method = RequestMethod.GET)
    public Result getTables(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("database") String database,
            @RequestParam("typeName") String typeName,
            HttpServletRequest request) {
        return metadataQueryService.queryTablesByDsName(dataSourceName,database,typeName);
    }

    @ApiOperation(value = "querySql", notes = "query sql")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "typeName", required = true, dataType = "String", value = "type name"),
            @ApiImplicitParam(name = "sql", required = true, dataType = "String", value = "sql")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_METADATA_SQL_ERROR)
    @RequestMapping(value = "/querySql", method = RequestMethod.GET)
    public Result querySelectSql(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("sql") String sql,
            @RequestParam("typeName") String typeName,
            HttpServletRequest request) {
        return metadataQueryService.queryBySql(dataSourceName,sql,typeName);
    }


    @ApiOperation(value = "querySql/id", notes = "query sql")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id"),
            @ApiImplicitParam(name = "typeId", required = true, dataType = "Long", value = "type id"),
            @ApiImplicitParam(name = "sql", required = true, dataType = "String", value = "sql")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_METADATA_SQL_ERROR)
    @RequestMapping(value = "/querySql/id", method = RequestMethod.GET)
    public Result querySelectSql(
            @RequestParam("dataSourceId") Long dataSourceId,
            @RequestParam("sql") String sql,
            @RequestParam("typeId") Long typeId,
            HttpServletRequest request) {
        return metadataQueryService.queryBySql(dataSourceId,sql,typeId);
    }


}
