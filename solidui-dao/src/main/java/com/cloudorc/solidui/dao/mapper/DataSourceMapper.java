package com.cloudorc.solidui.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.cloudorc.solidui.dao.entity.DataSource;
import org.apache.ibatis.annotations.Param;

public interface DataSourceMapper extends BaseMapper<DataSource> {

    DataSource queryByName(@Param("dataSourceName") String dataSourceName);

    int expireOne(@Param("dataSourceId") Long dataSourceId);

    IPage<DataSource> queryDataSourceByPage(IPage<DataSource> page,
                                         @Param("dataSourceName") String dataSourceName,@Param("dataSourceTypeId") Long dataSourceTypeId);
}
