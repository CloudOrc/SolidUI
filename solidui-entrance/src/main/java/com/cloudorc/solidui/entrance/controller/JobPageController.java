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

import com.cloudorc.solidui.common.utils.LoginUtils;
import com.cloudorc.solidui.dao.entity.JobPage;
import com.cloudorc.solidui.entrance.constants.Constants;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.service.ProjectService;
import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

import static com.cloudorc.solidui.entrance.enums.Status.*;
import static com.cloudorc.solidui.entrance.enums.Status.DELETE_PROJECT_ERROR;

@Api(tags = "job_page_tag")
@RestController
@RequestMapping("job/page")
public class JobPageController extends BaseController {


//
//        @Autowired
//        private ProjectService projectService;
//        /**
//         * create job page
//         *
//         * @param projectName project name
//         * @param description description
//         * @return returns an error if it exists
//         */
//        @ApiOperation(value = "createJobPage", notes = "create_job_page_notes")
//        @ApiImplicitParams({
//                @ApiImplicitParam(name = "projectId", value = "project_id", dataTypeClass = long.class),
//                @ApiImplicitParam(name = "description", value = "project_desc", dataTypeClass = String.class)
//        })
//        @ResponseStatus(HttpStatus.CREATED)
//        @ApiException(CREATE_JOB_PAGE_ERROR)
//        @RequestMapping(path = "", method = RequestMethod.POST)
//        public Result createJobPage(HttpServletRequest req,
//                                    @RequestBody JobPage jobPage) {
//
//            return null;
//        }
//
//        /**
//         * update project
//         *
//         * @param projectName project name
//         * @param description description
//         * @return update result code
//         */
//        @ApiOperation(value = "update", notes = "update_project_notes")
//        @ApiImplicitParams({
//                @ApiImplicitParam(name = "id", value = "project_id", dataTypeClass = int.class, example = "123456"),
//                @ApiImplicitParam(name = "projectName", value = "project_name", dataTypeClass = String.class),
//                @ApiImplicitParam(name = "description", value = "project_desc", dataTypeClass = String.class)
//        })
//        @ResponseStatus(HttpStatus.OK)
//        @ApiException(UPDATE_PROJECT_ERROR)
//        @RequestMapping(path = "/{id}", method = RequestMethod.PUT)
//        public Result updateProject(HttpServletRequest req,
//                                    @PathVariable("id") Integer projectId,
//                                    @RequestParam("projectName") String projectName,
//                                    @RequestParam(value = "description", required = false) String description) {
//
//            if(StringUtils.isBlank(projectName))   {
//                return error(Status.UPDATE_PROJECT_ERROR.getCode(),
//                        Status.UPDATE_PROJECT_ERROR.getMsg());
//            }
//
//            if(projectId == null)   {
//                return error(Status.UPDATE_PROJECT_ERROR.getCode(),
//                        Status.UPDATE_PROJECT_ERROR.getMsg());
//            }
//            return projectService.updateProject(projectId, projectName, description);
//        }
//
//
//        /**
//         * query project list paging
//         * @param searchName search name
//         * @param pageSize  page size
//         * @param pageNo    page number
//         * @return project list which the login user have permission to see
//         */
//        @ApiOperation(value = "queryProjectListPaging", notes = "query_project_list_paging_notes")
//        @ApiImplicitParams({
//                @ApiImplicitParam(name = "searchName", value = "search_name", dataTypeClass = String.class),
//                @ApiImplicitParam(name = "pageSize", value = "page_size", required = true, dataTypeClass = int.class, example = "10"),
//                @ApiImplicitParam(name = "pageNo", value = "page_no", required = true, dataTypeClass = int.class, example = "1")
//        })
//        @ResponseStatus(HttpStatus.OK)
//        @ApiException(LOGIN_USER_QUERY_PROJECT_LIST_PAGING_ERROR)
//        @RequestMapping(path = "/queryProjectListPaging", method = RequestMethod.GET)
//        public Result queryProjectListPaging(HttpServletRequest req,
//                                             @RequestParam(value = "searchName", required = false) String searchName,
//                                             @RequestParam(value ="pageSize", required = false) Integer pageSize,
//                                             @RequestParam(value ="pageNo", required = false) Integer pageNo) {
//
//            if (pageSize == null || pageSize <= 0) {
//                pageSize = Constants.DEFAULT_PAGE_SIZE;
//            }
//            if (pageNo == null || pageNo <= 0) {
//                pageNo = Constants.DEFAULT_PAGE_NO;
//            }
//            return projectService.queryProjectListPaging(searchName, pageNo, pageSize);
//        }
//
//        /**
//         * delete project by id
//         *
//         * @param projectId project id
//         * @return delete result id
//         */
//        @ApiOperation(value = "delete", notes = "delete_project_by_id_notes")
//        @ApiImplicitParams({
//                @ApiImplicitParam(name = "id", value = "project_id", dataTypeClass = int.class, example = "123456")
//        })
//        @ResponseStatus(HttpStatus.OK)
//        @ApiException(DELETE_PROJECT_ERROR)
//        @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
//        public Result deleteProject(HttpServletRequest req,
//                                    @PathVariable("id") Integer projectId) {
//            if(projectId == null)   {
//                return error(Status.DELETE_PROJECT_ERROR.getCode(),
//                        Status.DELETE_PROJECT_ERROR.getMsg());
//            }
//            return projectService.deleteProject(projectId);
//        }


}
