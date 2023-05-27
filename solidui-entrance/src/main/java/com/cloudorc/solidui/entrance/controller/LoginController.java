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

import static com.cloudorc.solidui.entrance.enums.Status.USER_LOGIN_FAILURE;
import static com.cloudorc.solidui.entrance.enums.Status.LOGIN_OUT_FAILURE;

import com.cloudorc.solidui.common.utils.LoginUtils;
import com.cloudorc.solidui.dao.entity.User;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.service.UserService;
import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * login controller
 * API
 */
@Api(tags = "login_tag")
@RestController
@RequestMapping("")
public class LoginController extends BaseController {
    @Autowired
    private UserService userService;


    @ApiOperation(value = "login", notes = "login_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "username", value = "USERNAME", required = true, dataTypeClass = String.class, example = "admin"),
            @ApiImplicitParam(name = "password", value = "PASSWORD", required = true, dataTypeClass = String.class, example = "admin")
    })
    @ApiException(USER_LOGIN_FAILURE)
    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public Result login(@RequestParam(value = "username") String username,
                        @RequestParam(value = "password") String password,
                        HttpServletRequest request,
                        HttpServletResponse response) {
        // user name check
        if (StringUtils.isBlank(username)) {
            return error(Status.USER_NAME_NULL.getCode(),
                    Status.USER_NAME_NULL.getMsg());
        }

        // user password check
        if (StringUtils.isBlank(password)) {
            return error(Status.PASSWORD_NAME_NULL.getCode(),
                    Status.PASSWORD_NAME_NULL.getMsg());
        }

        User user = userService.queryByUserNameAndPassword(username, password);
        Cookie cookie = LoginUtils.setLoginUser(user.getUserName());
        if(cookie == null) {
            return error(Status.USER_LOGIN_FAILURE.getCode(),
                    Status.USER_LOGIN_FAILURE.getMsg());
        }
        response.addCookie(cookie);
        response.setStatus(HttpStatus.SC_OK);
        return success();
    }


    /**
     * login out
     *
     * @return sign out result
     */
    @ApiOperation(value = "loginOut", notes = "login_out_notes")
    @ApiException(LOGIN_OUT_FAILURE)
    @RequestMapping(path = "/loginOut", method = RequestMethod.POST)
    public Result signOut(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();
        if(cookies == null) {
            return error(Status.LOGIN_OUT_FAILURE.getCode(),
                    Status.LOGIN_OUT_FAILURE.getMsg());
        }
        LoginUtils.removeLoginUser(cookies);
        return success();
    }



}
