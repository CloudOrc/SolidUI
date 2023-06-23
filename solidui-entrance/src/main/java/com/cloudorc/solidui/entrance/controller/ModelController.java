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

import static com.cloudorc.solidui.entrance.enums.Status.CREATE_JOB_ERROR;
import static com.cloudorc.solidui.entrance.enums.Status.QUERY_JOB_ERROR;

import com.cloudorc.solidui.entrance.exceptions.ApiException;
import com.cloudorc.solidui.entrance.utils.Result;
import com.cloudorc.solidui.entrance.vo.ModelCommandVO;
import com.cloudorc.solidui.entrance.vo.ModelKeyVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;

@Api(tags = "model_tag")
@RestController
@RequestMapping("models")
public class ModelController extends BaseController {

    @ApiOperation(value = "generate", notes = "generate_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "modelId", value = "modelId", dataTypeClass = int.class, example = "123456"),
            @ApiImplicitParam(name = "prompt", value = "prompt", dataTypeClass = String.class, example = "prompt"),
    })
    @ResponseStatus(HttpStatus.CREATED)
    @ApiException(CREATE_JOB_ERROR)
    @RequestMapping(path = "/generate", method = RequestMethod.POST)
    public Result executeModel(@RequestParam(value = "modelId", required = true) Long modelId,
                               @RequestParam(value = "prompt", required = true) String prompt) {

        String code = "import matplotlib.pyplot as plt\n" +
                "\n" +
                "data = [{\"x\":\"A\",\"y\":5},{\"x\":\"B\",\"y\":8},{\"x\":\"C\",\"y\":12},{\"x\":\"D\",\"y\":6},{\"x\":\"E\",\"y\":15},{\"x\":\"F\",\"y\":10}]\n"
                +
                "\n" +
                "x = [item[\"x\"] for item in data]\n" +
                "y = [item[\"y\"] for item in data]\n" +
                "\n" +
                "plt.bar(x, y)\n" +
                "plt.show()";
        Map<String, String> map = new HashMap<>();
        map.put("code", code);

        return Result.success(map);
    }

    @ApiOperation(value = "keys", notes = "keys_notes")
    @ApiImplicitParams({})
    @ResponseStatus(HttpStatus.OK)
    @ApiException(QUERY_JOB_ERROR)
    @RequestMapping(path = "/keys", method = RequestMethod.GET)
    public Result getJobPage(HttpServletRequest req) {

        List<ModelKeyVO> list = new ArrayList<>();
        ModelKeyVO modelKeyVO1 = new ModelKeyVO();
        ModelKeyVO modelKeyVO2 = new ModelKeyVO();
        modelKeyVO1.setId(1L);
        modelKeyVO1.setName("gpt-3.5");
        modelKeyVO2.setId(2L);
        modelKeyVO2.setName("gpt-4.0");
        list.add(modelKeyVO1);
        list.add(modelKeyVO2);

        return Result.success(list);
    }

    @ApiOperation(value = "api", notes = "api_notes")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "command", value = "command", dataTypeClass = String.class, example = "command")
    })
    @ResponseStatus(HttpStatus.CREATED)
    @ApiException(CREATE_JOB_ERROR)
    @RequestMapping(path = "/api", method = {RequestMethod.POST, RequestMethod.GET})
    public Result executeAPI(@RequestParam(value = "command", required = true) String command) {
        Result result = new Result();

        String co = "import matplotlib.pyplot as plt\n" +
                "\n" +
                "data = [{\"x\":\"A\",\"y\":5},{\"x\":\"B\",\"y\":8},{\"x\":\"C\",\"y\":12},{\"x\":\"D\",\"y\":6},{\"x\":\"E\",\"y\":15},{\"x\":\"F\",\"y\":10}]\n"
                +
                "\n" +
                "x_values = [item[\"x\"] for item in data]\n" +
                "y_values = [item[\"y\"] for item in data]\n" +
                "\n" +
                "plt.bar(x_values, y_values)\n" +
                "plt.show()";
        List<ModelCommandVO> list = new ArrayList<>();
        ModelCommandVO modelCommandVO = new ModelCommandVO();
        modelCommandVO.setType("image/png");
        modelCommandVO.setValue(
                "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GmPHji31eB3Wtp+1tWvXxmOPPRZDhw6Na6+9NkaMGBFbtmwp9Xgd2od/T7dt8+bNK/VYHd6Orlvfvn1LPVZSRftuF/5n8+bN8etf/zqWLVsWTU1NMWfOnLj55ptLPVaHl81mo1evXhER0atXr5g4cWKcdtpp8a9//SsOOuigEk/XMV111VWRyWRi6dKl0bVr19bjAwYMiMsvv7yEk3VsH/5ZO+SQQ+L444+PL37xi3H66afHnDlz4sorryzxhB3Xh68du851c+ej6ObPnx/9+vWLfv36xSWXXBL33Xffrn3dMK02bdoUDz74YBxxxBHRvXv3Uo/TIb311luxaNGiGDt2bJvw2KYzf19SMXz1q1+NQYMGxUMPPVTqUaBTEh9FNnv27Ljkkksi4n+32jZt2uT9913wyCOPxH777Rf77bdfVFZWxsKFC2P+/Pmxxx5+ZHdk9erVkc/no3///qUepdPo379/rF27ttRjdGgf/j3dtv3oRz8q9Vgd3kev2/nnn1/qkZLztksRvfrqq7F06dLW/3qqqKiICy64IO69994YNmxYiafr2IYOHRqzZs2KiP/9V/3MmTOjrq4uli5d+pn+3/TvzLa7aZlMpsSTdB75fN71/AQf/j3dplu3biWapnx89Lrt6G5lZyc+imj27NmxZcuWOOSQQ1qP5fP52HPPPWPjxo1xwAEHlHC6jq1r165xxBFHtO4PHjw4qqur45577okf//jHJZysYzryyCMjk8nEK6+8Euecc06px+kUXnnllc/chwDb66O/p+wa183bLkWzZcuW+OUvfxk/+clPYtWqVa3biy++GIcddlg8+OCDpR6xrGQymdhjjz3i3XffLfUoHVK3bt3irLPOip///OexefPm7R7/z3/+k36oMvbEE0/Eyy+/HOeee26pR4FOyZ2PInnkkUdi48aNccUVV0R1dXWbx84777yYPXt2XH311SWaruPL5XLR1NQUEREbN26MGTNmxKZNm2LkyJElnqzjmjlzZpx88slx0kknxa233hrHHHNMbNmyJRYvXhyzZs2KV155pdQjdkjbftY++OCD+Oc//xmLFi2KhoaGGDFiRFx66aWlHq9D+/Dv6TYVFRVx4IEHlmgiyoX4KJLZs2fHsGHDtguPiIhzzz03pk2bFitXrozjjz++BNN1fIsWLYqDDz44IiIqKyujf//+8Zvf/CaGDBlS2sE6sL59+8bKlStj6tSpcf3118f69evjoIMOisGDB2/3vjz/b9vPWkVFRRxwwAExaNCg+NnPfhajR4/2AedP8OHf02369esXf/3rX0s0EeUik/d3nwBAQrIeAEhKfAAASYkPACAp8QEAJCU+AICkxAcAkJT4AACSEh8AQFLiAwBISnwAAEmJDwAgKfEBACT1fzJrMwgVWiAPAAAAAElFTkSuQmCC");
        list.add(modelCommandVO);

        return Result.success(list);
    }

}
