package com.cloudorc.solidui.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudorc.solidui.dao.entity.JobElementPage;

import java.util.List;

public interface JobElementPageMapper extends BaseMapper<JobElementPage> {

    JobElementPage selectByJobElementId(Long jobElementId);

    List<JobElementPage> selectByProjectIdAndPageId(Long pageId);

    int deleteByProjectId(Long projectId);
}
