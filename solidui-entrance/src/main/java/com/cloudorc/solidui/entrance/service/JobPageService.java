package com.cloudorc.solidui.entrance.service;

import com.cloudorc.solidui.dao.entity.JobPage;
import com.cloudorc.solidui.entrance.utils.Result;

public interface JobPageService {

    Result createJobPage(JobPage jobPage);

    Result updateJobPage(JobPage jobPage);

    Result deleteJobPage(Long id);

    Result queryJobPagesByProjectId(Long projectId);

}
