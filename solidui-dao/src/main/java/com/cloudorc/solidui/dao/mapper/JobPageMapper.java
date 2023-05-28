package com.cloudorc.solidui.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudorc.solidui.dao.entity.JobPage;

import java.util.List;

public interface JobPageMapper extends BaseMapper<JobPage> {

    JobPage queryByName(String name);

    List<JobPage> queryJobPageListPaging(Long projectId);

    int deleteByProjectId(Long projectId);
}
