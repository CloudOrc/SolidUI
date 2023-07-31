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

package com.cloudorc.solidui.entrance.dto;


import com.cloudorc.solidui.entrance.vo.JobElementPageVO;

import java.util.Date;
import java.util.Map;

@lombok.Data
public class JobElementDTO {

    private Long id;

    private Long projectId;

    private String name;
    /**
     * data type
     * legend type
     */
    private String dataType;

    private Date createTime;

    private Date updateTime;

    private DataView dataView;

    public JobElementDTO() {
    }
    @lombok.Data
    public static class DataView {
        private JobElementPageVO.View.Position position;
        private JobElementPageVO.Size size;
        private Map<String, Object> options;
        private JobElementPageVO.View.Data data;

    }
}

