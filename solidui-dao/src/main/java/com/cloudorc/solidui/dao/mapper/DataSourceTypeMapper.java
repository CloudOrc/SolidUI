package com.cloudorc.solidui.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudorc.solidui.dao.entity.DataSourceType;

import java.util.List;

public interface DataSourceTypeMapper extends BaseMapper<DataSourceType> {

    List<DataSourceType> queryAllTypes();
}
