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
import com.cloudorc.solidui.entrance.service.JobService;
import com.cloudorc.solidui.entrance.utils.Result;
import com.cloudorc.solidui.entrance.vo.JobElementPageVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

import static com.cloudorc.solidui.entrance.enums.Status.*;

@Api(tags = "job_tag")
@RestController
@RequestMapping("job")
public class JobController extends BaseController {

    @Autowired
    private JobService jobService;

    @ApiOperation(value = "savePage", notes = "save_page_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "jobElementPageVO", value = "jobElementPageVO_data", dataTypeClass = JobElementPageVO.class)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @ApiException(CREATE_JOB_ERROR)
    @RequestMapping(path = "/save/page", method = RequestMethod.POST)
    public Result savePage(@RequestBody JobElementPageVO jobElementPageVO) {

        return jobService.createJob(jobElementPageVO);
    }

    //updateJob
    @ApiOperation(value = "updateJob", notes = "update_job_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "jobElementPageVO", value = "jobElementPageVO_data", dataTypeClass = JobElementPageVO.class)
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(UPDATE_JOB_ERROR)
    @RequestMapping(path = "/update/page", method = RequestMethod.PUT)
    public Result updateJobPage(HttpServletRequest req,
                                @RequestBody  JobElementPageVO jobElementPageVO){

        return jobService.updateJob(jobElementPageVO);
    }

    @ApiOperation(value = "queryList", notes = "query_job_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "projectId", value = "projectId", dataTypeClass = int.class, example = "123456"),
            @ApiImplicitParam(name = "pageId", value = "pageId", dataTypeClass = int.class, example = "123456")
    })
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_JOB_ERROR)
    @RequestMapping(path = "/query/page", method = RequestMethod.GET)
    public Result getJobPage(HttpServletRequest req,
                             @RequestParam("projectId") Long projectId,
                             @RequestParam("pageId") Long pageId){

        return jobService.queryJobsByProjectId(projectId,pageId);
    }


}
