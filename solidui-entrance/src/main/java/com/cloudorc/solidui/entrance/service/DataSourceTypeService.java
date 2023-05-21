package com.cloudorc.solidui.entrance.service;

import com.cloudorc.solidui.entrance.utils.Result;

public interface DataSourceTypeService {

    Result queryAllDataSourceTypes();

    Result queryDataSourceType(Long typeId);

    Result queryKeyByType(Long dataSourceTypeId);
}
