package com.cloudorc.solidui.entrance.service;

import com.cloudorc.solidui.entrance.utils.Result;
import com.cloudorc.solidui.entrance.vo.JobElementPageVO;

public interface JobService {

    Result createJob(JobElementPageVO jobElementPageVO);

    Result updateJob(JobElementPageVO jobElementPageVO);

    Result queryJobsByProjectId(Long projectId,Long pageId);
}
