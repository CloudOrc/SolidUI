/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.cloudorc.solidui.entrance.dto;

import com.cloudorc.solidui.common.utils.JSONUtils;
import com.cloudorc.solidui.dao.entity.DataSourceTypeKey;
import com.cloudorc.solidui.dao.entity.DataSourceType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.apache.commons.lang3.StringUtils;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.*;

/** Store the data source information */

@JsonSerialize(include = JsonSerialize.Inclusion.NON_EMPTY)
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, ignoreUnknown = true)
public class DataSourceDTO {

    private Long id;
    /** Data source name */
    @NotNull
    @Pattern(regexp = "^[\\w\\u4e00-\\u9fa5_-]+$")
    private String dataSourceName;

    /** Data source description */
    @Size(min = 0, max = 200)
    private String dataSourceDesc;

    /** ID of data source type */
    @NotNull
    private Long dataSourceTypeId;

    /** System name from creator */
    @NotNull
    private String createSystem;
    /** Connection parameters */
    private Map<String, Object> connectParams = new HashMap<>();
    /** Parameter JSON string */
    @JsonIgnore
    private String parameter;

    /** Create time */
    private Date createTime;

    private String createUser;

    private String labels;

    /** Data source type entity */
    private DataSourceType dataSourceType;


    @JsonIgnore
    private List<DataSourceTypeKey> keyDefinitions = new ArrayList<>();

    public DataSourceDTO() {
        this.createTime = Calendar.getInstance().getTime();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDataSourceName() {
        return dataSourceName;
    }

    public void setDataSourceName(String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }

    public String getDataSourceDesc() {
        return dataSourceDesc;
    }

    public void setDataSourceDesc(String dataSourceDesc) {
        this.dataSourceDesc = dataSourceDesc;
    }

    public Long getDataSourceTypeId() {
        return dataSourceTypeId;
    }

    public void setDataSourceTypeId(Long dataSourceTypeId) {
        this.dataSourceTypeId = dataSourceTypeId;
    }


    public String getCreateSystem() {
        return createSystem;
    }

    public void setCreateSystem(String createSystem) {
        this.createSystem = createSystem;
    }

    public String getParameter() {
        return parameter;
    }

    public void setParameter(String parameter) {
        this.parameter = parameter;
    }


    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }


    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }


    public DataSourceType getDataSourceType() {
        return dataSourceType;
    }

    public void setDataSourceType(DataSourceType dataSourceType) {
        this.dataSourceType = dataSourceType;
    }


    public List<DataSourceTypeKey> getKeyDefinitions() {
        return keyDefinitions;
    }

    public void setKeyDefinitions(List<DataSourceTypeKey> keyDefinitions) {
        this.keyDefinitions = keyDefinitions;
    }

    public String getLabels() {
        return labels;
    }

    public void setLabels(String labels) {
        this.labels = labels;
    }

    public Map<String, Object> getConnectParams() {
        if (connectParams.isEmpty() && StringUtils.isNotBlank(parameter)) {
            try {
                connectParams.putAll(Objects.requireNonNull(JSONUtils.parseObject(parameter, Map.class)));
            } catch (Exception e) {
                // Ignore
            }
        }
        return connectParams;
    }

    public void setConnectParams(Map<String, Object> connectParams) {
        this.connectParams = connectParams;
    }


}
