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

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloudorc.solidui.dao.entity.Project;
import com.cloudorc.solidui.dao.mapper.ProjectMapper;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.service.ProjectService;
import com.cloudorc.solidui.entrance.utils.PageInfo;
import com.cloudorc.solidui.entrance.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * project service impl
 */
@Service
public class ProjectServiceImpl extends BaseServiceImpl implements ProjectService {

    @Autowired
    private ProjectMapper projectMapper;

    /**
     * create project
     * @param loginUser
     * @param name
     * @param desc
     * @return
     */
    @Override
    public Result createProject(String loginUser, String name, String desc) {
        Project newProject = projectMapper.queryByName(name);
        Result result = new Result();
        if (newProject != null) {
            putMsg(result, Status.PROJECT_ALREADY_EXISTS_ERROR);
            return result;
        }

        Project project = new Project();
        project.setProjectName(name);
        project.setUserName(loginUser);
        project.setDescription(desc);
        project.setCreateTime(new Date());
        project.setUpdateTime(new Date());
        project.setStatus(0);
        if(projectMapper.insert(project) > 0){
            putMsg(result, Status.SUCCESS);
        }else{
            putMsg(result, Status.CREATE_PROJECT_ERROR);
        }
        return result;
    }

    @Override
    public Result updateProject(Integer projectId, String name, String desc) {
        Project newProject = projectMapper.selectById(projectId);
        Result result = new Result();
        if (newProject == null) {
            putMsg(result, Status.PROJECT_NOT_EXISTS_ERROR);
            return result;
        }
        newProject.setProjectName(name);
        newProject.setDescription(desc);
        newProject.setUpdateTime(new Date());
        newProject.setStatus(0);
        if(projectMapper.updateById(newProject) > 0){
            putMsg(result, Status.SUCCESS);
        }else{
            putMsg(result, Status.UPDATE_PROJECT_ERROR);
        }
        return result;
    }

    @Override
    public Result queryProjectListPaging(String searchName, Integer pageNo, Integer pageSize) {
        Result result = new Result();
        PageInfo<Project> pageInfo = new PageInfo<>(pageNo, pageSize);
        Page<Project> page = new Page<>(pageNo, pageSize);
        IPage<Project> projectIPage =
                projectMapper.queryProjectListPaging(page, searchName);
        List<Project> projectList = projectIPage.getRecords();
        pageInfo.setTotal((int) projectIPage.getTotal());
        pageInfo.setTotalList(projectList);
        result.setData(pageInfo);
        putMsg(result, Status.SUCCESS);
        return result;
    }

    @Override
    public Result deleteProject(Integer projectId) {
        Result result = new Result();
        Project project = projectMapper.selectById(projectId);

        if (project == null) {
            putMsg(result, Status.PROJECT_NOT_EXISTS_ERROR);
            return result;
        }
        project.setStatus(1);
        if(projectMapper.updateById(project) > 0) {
            putMsg(result, Status.SUCCESS);
        }else{
            putMsg(result, Status.DELETE_PROJECT_ERROR);
        }
        return result;
    }

    @Override
    public Result getProject(Integer projectId) {
        Result result = new Result();
        Project project = projectMapper.selectById(projectId);

        if (project == null) {
            putMsg(result, Status.PROJECT_NOT_EXISTS_ERROR);
            return result;
        }
        putMsg(result, Status.SUCCESS);
        result.setData(project);
        return result;
    }
}
