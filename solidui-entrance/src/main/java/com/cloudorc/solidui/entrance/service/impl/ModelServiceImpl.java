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
package com.cloudorc.solidui.entrance.service.impl;

import com.cloudorc.solidui.dao.entity.ModelType;
import com.cloudorc.solidui.dao.mapper.ModelTypeMapper;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.service.ModelService;
import com.cloudorc.solidui.entrance.utils.Result;
import com.cloudorc.solidui.entrance.vo.ModelKeyVO;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ModelServiceImpl extends BaseServiceImpl implements ModelService {

    @Autowired
    private ModelTypeMapper modelTypeMapper;

    @Override
    public Result queryModelList() {
        Result result = new Result();
        List<ModelType> modelTypes = modelTypeMapper.queryList();
        List<ModelKeyVO> modelKeyVOS = new ArrayList<>();

        if (!CollectionUtils.isEmpty(modelTypes)) {
            for (ModelType m : modelTypes) {
                modelKeyVOS.add(new ModelKeyVO(m.getId(), m.getName() + "_" + m.getCode(), m.getTypeName()));
            }
        }

        result.setData(modelKeyVOS);
        putMsg(result, Status.SUCCESS);
        return result;
    }
}
