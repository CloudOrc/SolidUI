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

import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(tags = "METADATA_QUERY")
@RestController
@RequestMapping("metadataQuery")
public class MetadataQueryController extends BaseController {

    @ApiOperation(value = "getDatabases", notes = "get databases")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "system", required = true, dataType = "String", value = "system")
    })
    @RequestMapping(value = "/getDatabases", method = RequestMethod.GET)
    public Result getDatabases(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("system") String system,
            HttpServletRequest request) {
        List<String> databases =new ArrayList<>();
        databases.add("db1");
        databases.add("db2");
        return Result.success(databases);

    }

    @ApiOperation(value = "getTables", notes = "get tables")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "system", required = true, dataType = "String", value = "system"),
            @ApiImplicitParam(name = "database", required = true, dataType = "String", value = "database")
    })
    @RequestMapping(value = "/getTables", method = RequestMethod.GET)
    public Result getTables(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("database") String database,
            @RequestParam("system") String system,
            HttpServletRequest request) {
        List<String> tables = new ArrayList<>();
        tables.add("table1");
        tables.add("table2");
        return Result.success(tables);

    }

    @ApiOperation(value = "getTableProps", notes = "get table props")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "system", required = true, dataType = "String", value = "system"),
            @ApiImplicitParam(name = "database", required = true, dataType = "String", value = "database"),
            @ApiImplicitParam(name = "table", required = true, dataType = "String", value = "table")
    })
    @RequestMapping(value = "/getTableProps", method = RequestMethod.GET)
    public Result getTableProps(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("database") String database,
            @RequestParam("table") String table,
            @RequestParam("system") String system,
            HttpServletRequest request) {
        Map<String, String> tableProps = new HashMap<>();
        tableProps.put("prop1", "value1");
        tableProps.put("prop2", "value2");
        return Result.success(tableProps);
    }

    @ApiOperation(value = "getPartitions", notes = "get partitions")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "system", required = true, dataType = "String", value = "system"),
            @ApiImplicitParam(name = "database", required = true, dataType = "String", value = "database"),
            @ApiImplicitParam(name = "table", required = true, dataType = "String", value = "table")
    })
    @RequestMapping(value = "/getPartitions", method = RequestMethod.GET)
    public Result getPartitions(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("database") String database,
            @RequestParam("table") String table,
            @RequestParam("system") String system,
            @RequestParam(name = "traverse", required = false, defaultValue = "false")
                    Boolean traverse,
            HttpServletRequest request) {
        return success();
    }

    @ApiOperation(value = "getPartitionProps", notes = "get partition pProps")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "system", required = true, dataType = "String", value = "System"),
            @ApiImplicitParam(name = "database", required = true, dataType = "String", value = "database"),
            @ApiImplicitParam(name = "table", required = true, dataType = "String", value = "Table"),
            @ApiImplicitParam(name = "partition", required = true, dataType = "String", value = "partition")
    })
    @RequestMapping(value = "getPartitionProps", method = RequestMethod.GET)
    public Result getPartitionProps(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("database") String database,
            @RequestParam("table") String table,
            @RequestParam("partition") String partition,
            @RequestParam("system") String system,
            HttpServletRequest request) {
        Map<String, String> partitionProps = new HashMap<>();
        partitionProps.put("prop1", "value1");
        partitionProps.put("prop2", "value2");
        return Result.success(partitionProps);
    }

    @ApiOperation(value = "getColumns", notes = "get columns")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name"),
            @ApiImplicitParam(name = "system", required = true, dataType = "String", value = "system"),
            @ApiImplicitParam(name = "database", required = true, dataType = "String", value = "database"),
            @ApiImplicitParam(name = "table", required = true, dataType = "String", value = "table")
    })
    @RequestMapping(value = "/getColumns", method = RequestMethod.GET)
    public Result getColumns(
            @RequestParam("dataSourceName") String dataSourceName,
            @RequestParam("database") String database,
            @RequestParam("table") String table,
            @RequestParam("system") String system,
            HttpServletRequest request) {
       return success();
    }


}
