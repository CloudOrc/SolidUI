package com.cloudorc.solidui.entrance.controller;

import static com.cloudorc.solidui.entrance.enums.Status.USER_LOGIN_FAILURE;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * login controller
 * API
 */
@Api(tags = "LOGIN_TAG")
@RestController
@RequestMapping("")
public class LoginController extends BaseController {

    //login Request interface, participant user name, and password
    @ApiOperation(value = "login", notes = "LOGIN_NOTES")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "username", value = "USERNAME", required = true, dataTypeClass = String.class, example = "admin"),
            @ApiImplicitParam(name = "password", value = "PASSWORD", required = true, dataTypeClass = String.class, example = "admin")
    })
    @ApiException(USER_LOGIN_FAILURE)
    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public Result login(@RequestParam(value = "username") String username,
                        @RequestParam(value = "password") String password) {
        // user name check
        if (StringUtils.isEmpty(username)) {
            return error(Status.USER_NAME_NULL.getCode(),
                    Status.USER_NAME_NULL.getMsg());
        }

        // verify username and password
       // Map<String, Object> loginResult = userService.login(username, password, ip);
        //loginResult.get(Constants.STATUS) == Status.SUCCESS
        return success();
    }


}
