package com.cloudorc.solidui.entrance.controller;

import static com.cloudorc.solidui.entrance.enums.Status.CREATE_PROJECT_ERROR;
import static com.cloudorc.solidui.entrance.enums.Status.DELETE_PROJECT_ERROR;
import static com.cloudorc.solidui.entrance.enums.Status.LOGIN_USER_QUERY_PROJECT_LIST_PAGING_ERROR;
import static com.cloudorc.solidui.entrance.enums.Status.QUERY_PROJECT_DETAILS_BY_CODE_ERROR;
import static com.cloudorc.solidui.entrance.enums.Status.UPDATE_PROJECT_ERROR;

import com.cloudorc.solidui.entrance.constants.Constants;
import com.cloudorc.solidui.entrance.dto.Project;
import com.cloudorc.solidui.entrance.dto.User;
import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.utils.PageInfo;
import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;
//import com.baomidou.mybatisplus.core.metadata.IPage;
//import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

@Api(tags = "PROJECT_TAG")
@RestController
@RequestMapping("projects")
public class ProjectController extends BaseController{

    /**
     * create project
     *
     * @param loginUser   login user
     * @param projectName project name
     * @param description description
     * @return returns an error if it exists
     */
    @ApiOperation(value = "create", notes = "CREATE_PROJECT_NOTES")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "projectName", value = "PROJECT_NAME", dataTypeClass = String.class),
            @ApiImplicitParam(name = "description", value = "PROJECT_DESC", dataTypeClass = String.class)
    })
    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @ApiException(CREATE_PROJECT_ERROR)

    public Result createProject(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser,
                                @RequestParam("projectName") String projectName,
                                @RequestParam(value = "description", required = false) String description) {
        Project project = new Project();
        project.setName(projectName);
        project.setDescription(description);
        return success(project);
    }

    /**
     * update project
     *
     * @param loginUser   login user
     * @param code        project code
     * @param projectName project name
     * @param description description
     * @return update result code
     */
    @ApiOperation(value = "update", notes = "UPDATE_PROJECT_NOTES")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code", value = "PROJECT_CODE", dataTypeClass = long.class, example = "123456"),
            @ApiImplicitParam(name = "projectName", value = "PROJECT_NAME", dataTypeClass = String.class),
            @ApiImplicitParam(name = "description", value = "PROJECT_DESC", dataTypeClass = String.class),
            @ApiImplicitParam(name = "userName", value = "USER_NAME", dataTypeClass = String.class),
    })
    @PutMapping(value = "/{code}")
    @ResponseStatus(HttpStatus.OK)
    @ApiException(UPDATE_PROJECT_ERROR)

    public Result updateProject(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser,
                                @PathVariable("code") Long code,
                                @RequestParam("projectName") String projectName,
                                @RequestParam(value = "description", required = false) String description,
                                @RequestParam(value = "userName") String userName) {
        Project project = new Project();
        project.setName(projectName);
        project.setDescription(description);
        return success(project);
    }

    /**
     * query project details by code
     *
     * @param loginUser login user
     * @param code      project code
     * @return project detail information
     */
    @ApiOperation(value = "queryProjectByCode", notes = "QUERY_PROJECT_BY_ID_NOTES")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code", value = "PROJECT_CODE", dataTypeClass = long.class, example = "123456")
    })
    @GetMapping(value = "/{code}")
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_PROJECT_DETAILS_BY_CODE_ERROR)
    public Result queryProjectByCode(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser,
                                     @PathVariable("code") long code) {
        Project project = new Project();
        project.setName("projectName");
        project.setDescription("description");
        return success(project);
    }

    /**
     * query project list paging
     *
     * @param loginUser login user
     * @param searchVal search value
     * @param pageSize  page size
     * @param pageNo    page number
     * @return project list which the login user have permission to see
     */
    @ApiOperation(value = "queryProjectListPaging", notes = "QUERY_PROJECT_LIST_PAGING_NOTES")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "searchVal", value = "SEARCH_VAL", dataTypeClass = String.class),
            @ApiImplicitParam(name = "pageSize", value = "PAGE_SIZE", required = true, dataTypeClass = int.class, example = "10"),
            @ApiImplicitParam(name = "pageNo", value = "PAGE_NO", required = true, dataTypeClass = int.class, example = "1")
    })
    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    @ApiException(LOGIN_USER_QUERY_PROJECT_LIST_PAGING_ERROR)
    public Result queryProjectListPaging(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser,
                                         @RequestParam(value = "searchVal", required = false) String searchVal,
                                         @RequestParam("pageSize") Integer pageSize,
                                         @RequestParam("pageNo") Integer pageNo) {

        Result result = new Result();

        return success();
    }

    /**
     * delete project by code
     *
     * @param loginUser login user
     * @param code      project code
     * @return delete result code
     */
    @ApiOperation(value = "delete", notes = "DELETE_PROJECT_BY_ID_NOTES")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code", value = "PROJECT_CODE", dataTypeClass = long.class, example = "123456")
    })
    @DeleteMapping(value = "/{code}")
    @ResponseStatus(HttpStatus.OK)
    @ApiException(DELETE_PROJECT_ERROR)
    public Result deleteProject(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser,
                                @PathVariable("code") Long code) {
        return success();
    }
}
