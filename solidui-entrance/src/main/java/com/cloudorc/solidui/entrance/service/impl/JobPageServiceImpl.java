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

import com.cloudorc.solidui.common.constants.Constants;
import com.cloudorc.solidui.dao.entity.JobPage;
import com.cloudorc.solidui.dao.mapper.JobPageMapper;
import com.cloudorc.solidui.entrance.dto.JobPageDTO;
import com.cloudorc.solidui.entrance.enums.Status;
import com.cloudorc.solidui.entrance.service.JobPageService;
import com.cloudorc.solidui.entrance.utils.Result;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * job page service impl
 */
@Service
public class JobPageServiceImpl extends BaseServiceImpl implements JobPageService {

    @Autowired
    private JobPageMapper jobPageMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result createJobPage(JobPage jobPage) {
        Result result = new Result();
        String pageName = jobPage.getName();
        JobPage jobPage1 = jobPageMapper.queryByName(pageName);
        if (jobPage1 != null) {
            // page name already exists
            putMsg(result, Status.JOB_PAGE_ALREADY_EXISTS_ERROR);
            return result;
        }

        Long parentId = jobPage.getParentId();
        if (parentId != null && parentId != 0L) {
            JobPage jobPage2 = jobPageMapper.selectById(parentId);
            if (jobPage2 == null) {
                // parent page not exists
                putMsg(result, Status.QUERY_JOB_PAGE_ERROR);
                return result;
            }
            // parent page exists
            jobPage.setLayout(Constants.JOB_PAGE_LAYOUT_TWO);
            jobPage.setParentId(jobPage2.getId());
        } else {
            jobPage.setParentId(0L);
            jobPage.setLayout(Constants.JOB_PAGE_LAYOUT_ONE);
        }

        jobPage.setCreateTime(new Date());
        jobPage.setUpdateTime(new Date());

        if (jobPageMapper.insert(jobPage) > 0) {
            result.setData(jobPage);
            putMsg(result, Status.SUCCESS);
        } else {
            putMsg(result, Status.CREATE_JOB_PAGE_ERROR);
        }

        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result updateJobPage(JobPage jobPage) {
        Long id = jobPage.getId();
        // check page exists
        JobPage jobPage1 = jobPageMapper.selectById(id);
        Result result = new Result();
        if (jobPage1 == null) {
            putMsg(result, Status.QUERY_JOB_PAGE_ERROR);
            return result;
        }
        jobPage.setUpdateTime(new Date());

        if (jobPageMapper.updateById(jobPage) > 0) {
            putMsg(result, Status.SUCCESS);
        } else {
            putMsg(result, Status.UPDATE_JOB_PAGE_ERROR);
        }

        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result deleteJobPage(Long id) {
        Result result = new Result();
        JobPage jobPage = jobPageMapper.selectById(id);
        if (jobPage == null) {
            putMsg(result, Status.QUERY_JOB_PAGE_ERROR);
            return result;
        }
        Long parentId = jobPage.getId();
        List<JobPage> jobPages = jobPageMapper.queryJobPageParentIds(parentId);
        if (!CollectionUtils.isEmpty(jobPages)) {
            for (JobPage page : jobPages) {
                jobPageMapper.deleteById(page.getId());
            }
        }

        if (jobPageMapper.deleteById(id) > 0) {
            putMsg(result, Status.SUCCESS);
        } else {
            putMsg(result, Status.DELETE_JOB_PAGE_ERROR);
        }
        return result;
    }

    @Override
    public Result queryJobPagesByProjectId(Long projectId) {
        Result result = new Result();
        // check project exists
        if (projectId == null) {
            putMsg(result, Status.PROJECT_NOT_EXISTS_ERROR);
            return result;
        }
        // query job pages by project id
        List<JobPage> jobPages = jobPageMapper.queryJobPageListPaging(projectId);
        if (CollectionUtils.isEmpty(jobPages)) {
            result.setData(Collections.emptyList());
            putMsg(result, Status.SUCCESS);
            // putMsg(result, Status.QUERY_JOB_PAGE_ERROR);
            return result;
        }

        // Convert JobPage to JobPageDTO
        List<JobPageDTO> jobPageDTOs = jobPages.stream()
                .map(m -> {
                    JobPageDTO jobPageDTO = new JobPageDTO();
                    BeanUtils.copyProperties(m, jobPageDTO);
                    return jobPageDTO;
                }).collect(Collectors.toList());

        // Sort by parentId and order
        List<JobPageDTO> sortedJobPageDTOs = jobPageDTOs.stream()
                .sorted(Comparator.comparing(JobPageDTO::getParentId, Comparator.nullsFirst(Comparator.naturalOrder()))
                        .thenComparing(JobPageDTO::getOrders))
                .collect(Collectors.toList());

        // Group job pages into two levels: top-level and second-level
        List<JobPageDTO> topLevelJobPageDTOs = sortedJobPageDTOs.stream()
                .filter(jobPageDTO -> jobPageDTO.getLayout() == 1)
                .collect(Collectors.toList());

        List<JobPageDTO> secondLevelJobPageDTOs = sortedJobPageDTOs.stream()
                .filter(jobPageDTO -> jobPageDTO.getLayout() == 2)
                .collect(Collectors.toList());

        // Nest second-level job pages under their parent top-level job pages
        for (JobPageDTO topLevelJobPageDTO : topLevelJobPageDTOs) {
            topLevelJobPageDTO.setChildren(secondLevelJobPageDTOs.stream()
                    .filter(secondLevelJobPageDTO -> secondLevelJobPageDTO.getParentId()
                            .equals(topLevelJobPageDTO.getId()))
                    .collect(Collectors.toList()));
        }

        result.setData(topLevelJobPageDTOs);
        putMsg(result, Status.SUCCESS);

        return result;
    }
}
