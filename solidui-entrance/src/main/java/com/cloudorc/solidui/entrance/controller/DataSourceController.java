package com.cloudorc.solidui.entrance.controller;

import com.cloudorc.solidui.entrance.dto.DataSource;
import com.cloudorc.solidui.entrance.dto.DataSourceParamKeyDefinition;
import com.cloudorc.solidui.entrance.dto.DataSourceType;
import com.cloudorc.solidui.entrance.dto.DatasourceVersion;
import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.groups.Default;
import java.io.UnsupportedEncodingException;
import java.util.*;

@Api(tags = "DATASOURCE_TAG")
@RestController
@RequestMapping("datasource")
public class DataSourceController extends BaseController {

    @ApiOperation(value = "getAllDataSourceTypes", notes = "get all data source types")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/type/all", method = RequestMethod.GET)
    public Result getAllDataSourceTypes() {
        List<DataSourceType> dataSourceTypes  = new ArrayList<>();
        DataSourceType dataSourceType = new DataSourceType();
        dataSourceType.setId("1");
        dataSourceType.setName("mysql");
        dataSourceTypes.add(dataSourceType);

        return success(dataSourceTypes);
    }

    @ApiOperation(value = "getKeyDefinitionsByType", notes = "get key definitions by type")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "typeId", required = true, dataType = "Long", value = "type id")
    })
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/key-define/type/{typeId}", method = RequestMethod.GET)
    public Result getKeyDefinitionsByType(
            @PathVariable("typeId") Long dataSourceTypeId, HttpServletRequest req) {
        List<DataSourceParamKeyDefinition> keyDefinitions = new ArrayList<>();
        DataSourceParamKeyDefinition keyDefinition = new DataSourceParamKeyDefinition();
        keyDefinition.setKey("host");
        keyDefinition.setName("host");
        keyDefinition.setDefaultValue("");
        keyDefinitions.add(keyDefinition);
        return success(keyDefinitions);
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
     * create or update parameter, save a version of parameter,return version id.
     *
     * @param params
     * @param req
     * @return
     */
    @ApiOperation(value = "insertJsonParameter", notes = "insert json parameter")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/parameter/{dataSourceId}/json", method = RequestMethod.POST)
    public Result insertJsonParameter(
            @PathVariable("dataSourceId") Long dataSourceId,
            @RequestBody() Map<String, Object> params,
            HttpServletRequest req) {

        long versionId=1L;
        return success(versionId);

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


    @ApiOperation(value = "getPublishedInfoByDataSourceName", notes = "get published info by data source name")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name")
    })
    @RequestMapping(value = "/publishedInfo/name/{dataSourceName}", method = RequestMethod.GET)
    public Result getPublishedInfoByDataSourceName(
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
     * get datasource detail
     *
     * @param dataSourceId
     * @param version
     * @return
     */
    @ApiOperation(value = "getInfoByDataSourceIdAndVersion",notes = "get info by data source id and version")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id"),
            @ApiImplicitParam(name = "version", required = true, dataType = "Long", value = "version")
    })
    @RequestMapping(value = "/info/{dataSourceId}/{version}", method = RequestMethod.GET)
    public Result getInfoByDataSourceIdAndVersion(
            @PathVariable("dataSourceId") Long dataSourceId,
            @PathVariable("version") Long version,
            HttpServletRequest request) {
        DataSource dataSource = new DataSource();
        dataSource.setDataSourceName("test");
        dataSource.setDataSourceDesc("test");
        dataSource.setDataSourceTypeId(1L);
        dataSource.setLabels("test");
        dataSource.setConnectParams(new HashMap<>());
        return success(dataSource);
    }

    /**
     * get verion list for datasource
     *
     * @param dataSourceId
     * @param request
     * @return
     */
    @ApiOperation(value = "getVersionList", notes = "get version list")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/{dataSourceId}/versions", method = RequestMethod.GET)
    public Result getVersionList(
            @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest request) {
        List<DatasourceVersion> versions = new ArrayList<>();
        DatasourceVersion version = new DatasourceVersion();
        version.setVersionId(1L);

        version.setCreateTime(new Date());
        versions.add(version);
        return success(versions);
    }

    @ApiOperation(value = "publishByDataSourceId", notes = "publish by data source id")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id"),
            @ApiImplicitParam(name = "version", required = true, dataType = "Long", value = "version")
    })
    @RequestMapping(value = "/publish/{dataSourceId}/{versionId}", method = RequestMethod.POST)
    public Result publishByDataSourceId(
            @PathVariable("dataSourceId") Long dataSourceId,
            @PathVariable("versionId") Long versionId,
            HttpServletRequest request) {
        return success();
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

    /**
     * get datasource connect params for publish version
     *
     * @param dataSourceId
     * @param req
     * @return
     */
    @ApiOperation(value = "getConnectParams(dataSourceId)", notes = "get connect params(dataSourceId)")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id")
    })
    @RequestMapping(value = "/{dataSourceId}/connect-params", method = RequestMethod.GET)
    public Result getConnectParams(
            @PathVariable("dataSourceId") Long dataSourceId, HttpServletRequest req) {
        Map<String, Object> connectParams = new HashMap<>();
        connectParams.put("url", "jdbc:mysql://localhost:3306/test");
        return success(connectParams);

    }

    @ApiOperation(value = "getConnectParams(dataSourceName)", notes = "get connect params(dataSourceName)")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceName", required = true, dataType = "String", value = "data source name")
    })
    @RequestMapping(value = "/name/{dataSourceName}/connect-params", method = RequestMethod.GET)
    public Result getConnectParams(
            @PathVariable("dataSourceName") String dataSourceName, HttpServletRequest req)
            throws UnsupportedEncodingException {
        Map<String, Object> connectParams = new HashMap<>();
        connectParams.put("url", "jdbc:mysql://localhost:3306/test");
        return success(connectParams);
    }

    @ApiOperation(value = "connectDataSource", notes = "connect data source")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dataSourceId", required = true, dataType = "Long", value = "data source id"),
            @ApiImplicitParam(name = "version", required = true, dataType = "Long", value = "version")
    })
    @RequestMapping(value = "/{dataSourceId}/{version}/op/connect", method = RequestMethod.PUT)
    public Result connectDataSource(
            @PathVariable("dataSourceId") Long dataSourceId,
            @PathVariable("version") Long version,
            HttpServletRequest req) {
        return success(true);
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
