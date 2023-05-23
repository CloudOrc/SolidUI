package com.cloudorc.solidui.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudorc.solidui.dao.entity.DataSourceTypeKey;

import java.util.List;

public interface DataSourceParamKeyMapper extends BaseMapper<DataSourceTypeKey> {

    List<DataSourceTypeKey> queryByDataSourceTypeId(Long dataSourceTypeId);
}
