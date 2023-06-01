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

package com.cloudorc.solidui.entrance.utils;

import com.cloudorc.solidui.common.constants.Constants;
import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.entrance.dto.DataSourceDTO;
import com.cloudorc.solidui.plugin.jdbc.ConnectDTO;
import com.cloudorc.solidui.plugin.jdbc.JdbcClient;
import com.cloudorc.solidui.plugin.jdbc.JdbcClientFactory;
import com.cloudorc.solidui.spi.ConstantsSPI;

import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataSourceUtils {

    private final static Logger logger = LoggerFactory.getLogger(DataSourceUtils.class);
    private final static Map<String, JdbcClientFactory> jdbcClientFactoryInstances = new ConcurrentHashMap<>();
    /**
     * queryJdbcClientFactory
     * @param typeName typeName
     * @return JdbcClientFactory
     */
    public static JdbcClientFactory queryJdbcClientFactory(String typeName) throws ClassNotFoundException, NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException, SQLException {
        // MySqlClientFactory ClassLoader
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        String[] typeList = ConstantsSPI.DATASOURCE_TYPE_LIST.split(Constants.COMMA);
        if (!Arrays.asList(typeList).contains(typeName)) {
            throw new IllegalArgumentException(typeName + " is not supported");
        }
        JdbcClientFactory jdbcClientFactory = jdbcClientFactoryInstances.get(typeName);
        if (jdbcClientFactory == null) {
            String prefix = typeName.substring(0, 1).toUpperCase() + typeName.substring(1);
            String className = String.format(ConstantsSPI.DATASOURCE_CLASSNAME, prefix);
            Class<?> clazz = classLoader.loadClass(className);
            Object instance = clazz.getDeclaredConstructor().newInstance();
            if (!(instance instanceof JdbcClientFactory)) {
                throw new IllegalArgumentException(className + "JdbcClientFactory implements error");
            }
            jdbcClientFactory = (JdbcClientFactory) instance;
            jdbcClientFactoryInstances.put(typeName, jdbcClientFactory);
        }

        return jdbcClientFactory;

    }

    public static JdbcClient queryJdbcClient(String typeName,
                                             DataSource dataSource) throws SQLException, ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        JdbcClient jdbcClient = null;
        JdbcClientFactory jdbcClientFactory = DataSourceUtils.queryJdbcClientFactory(typeName);
        DataSourceDTO dataSourceDTO = new DataSourceDTO();
        dataSourceDTO.setId(dataSource.getId());
        dataSourceDTO.setParameter(dataSource.getParameter());
        ConnectDTO connectDTO = jdbcClientFactory.getConnectDTO(dataSourceDTO.getConnectParams());
        if (connectDTO != null) {
            jdbcClient = jdbcClientFactory.createJdbcClient(connectDTO);
        }
        return jdbcClient;
    }
}
