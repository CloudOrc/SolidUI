package com.cloudorc.solidui.entrance.service;

import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.entrance.exceptions.ServiceException;
import com.cloudorc.solidui.entrance.utils.Result;

public interface DataSourceService {
    /**
     * create data source info
     * @param dataSource
     * @throws ServiceException
     */
    Result createDataSource(DataSource dataSource) throws ServiceException;
    /**
     * query data source info
     * @param dataSourceId
     * @return
     */
    Result queryDataSource(Long dataSourceId);

    Result queryDataSource(String dataSourceName);

    Result existDataSource(Long dataSourceId);

    Result queryDataSourceByPage(String dataSourceName, Long dataSourceTypeId, Integer pageNo, Integer pageSize);

    Result deleteDataSource(Long dataSourceId);

    Result updateDataSource(DataSource dataSource) throws ServiceException;

}
