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

import com.cloudorc.solidui.dao.entity.JobPage;
import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.service.JobPageService;
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

@Api(tags = "job_page_tag")
@RestController
@RequestMapping("job/page")
public class JobPageController extends BaseController {


    @Autowired
    private JobPageService jobPageService;

    @ApiOperation(value = "create", notes = "create_job_page_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "projectId", value = "project_id", dataTypeClass = Long.class),
            @ApiImplicitParam(name = "name", value = "job_page_name", dataTypeClass = String.class),
            @ApiImplicitParam(name = "order", value = "job_page_order", dataTypeClass = Long.class),
            @ApiImplicitParam(name = "parentId", value = "job_page_parent_id", dataTypeClass = String.class, required = false),
            @ApiImplicitParam(name = "layout", value = "job_page_layout", dataTypeClass = String.class, required = false)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @ApiException(CREATE_JOB_PAGE_ERROR)
    @RequestMapping(path = "", method = RequestMethod.POST)
    public Result createJobPage(HttpServletRequest req,
                                @RequestBody JobPage jobPage){

        return jobPageService.createJobPage(jobPage);
    }

    //update job page
    @ApiOperation(value = "update", notes = "update_job_page_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "job_page_id", dataTypeClass = Long.class),
            @ApiImplicitParam(name = "projectId", value = "project_id", dataTypeClass = Long.class),
            @ApiImplicitParam(name = "name", value = "job_page_name", dataTypeClass = String.class),
            @ApiImplicitParam(name = "order", value = "job_page_order", dataTypeClass = Long.class),
            @ApiImplicitParam(name = "parentId", value = "job_page_parent_id", dataTypeClass = String.class, required = false),
            @ApiImplicitParam(name = "layout", value = "job_page_layout", dataTypeClass = String.class, required = false)
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(UPDATE_JOB_PAGE_ERROR)
    @RequestMapping(path = "/{id}", method = RequestMethod.PUT)
    public Result updateJobPage(HttpServletRequest req,
                                @RequestBody JobPage jobPage){

        return jobPageService.updateJobPage(jobPage);
    }

    //delete job page
    @ApiOperation(value = "delete", notes = "delete_job_page_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "id", dataTypeClass = int.class, example = "123456")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(DELETE_JOB_PAGE_ERROR)
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public Result deleteJobPage(HttpServletRequest req,
                                @PathVariable("id") Long id){

        return jobPageService.deleteJobPage(id);
    }

    //get job page
    @ApiOperation(value = "queryList", notes = "query_job_page_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "projectId", value = "projectId", dataTypeClass = int.class, example = "123456")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_JOB_PAGE_ERROR)
    @RequestMapping(path = "queryList/{projectId}", method = RequestMethod.GET)
    public Result getJobPage(HttpServletRequest req,
                             @PathVariable("projectId") Long projectId){

        return jobPageService.queryJobPagesByProjectId(projectId);
    }


}
