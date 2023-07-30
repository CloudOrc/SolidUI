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

import static com.cloudorc.solidui.entrance.enums.Status.QUERY_MODEL_TYPE_ERROR;

import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.service.ModelService;
import com.cloudorc.solidui.entrance.utils.Result;
import org.springframework.web.bind.annotation.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

@Api(tags = "keys_tag")
@RestController
@RequestMapping("keys")
public class ModelController extends BaseController {

    @Autowired
    private ModelService modelService;

    @ApiOperation(value = "list", notes = "keys_notes")
    @ApiImplicitParams({})
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_MODEL_TYPE_ERROR)
    @RequestMapping(path = "/list", method = RequestMethod.GET)
    public Result getModelList(HttpServletRequest req) {

        return modelService.queryModelList();
    }

}
