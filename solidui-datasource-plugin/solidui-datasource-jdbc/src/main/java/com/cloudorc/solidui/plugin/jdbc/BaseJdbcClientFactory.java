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


package com.cloudorc.solidui.plugin.jdbc;


import com.cloudorc.solidui.spi.ConstantsSPI;

import java.util.HashMap;
import java.util.Map;

public abstract class BaseJdbcClientFactory  implements JdbcClientFactory {

    public ConnectDTO getConnectDTO(Map<String, Object> connParams) {
        ConnectDTO connectDTO = new ConnectDTO();
        connectDTO.setHost((String) connParams.get(ConstantsSPI.PARAM_SQL_HOST));
        connectDTO.setPort((Integer) connParams.get(ConstantsSPI.PARAM_SQL_PORT));
        connectDTO.setUsername((String) connParams.get(ConstantsSPI.PARAM_SQL_USERNAME));
        connectDTO.setPassword((String) connParams.get(ConstantsSPI.PARAM_SQL_PASSWORD));
        connectDTO.setDatabase((String) connParams.get(ConstantsSPI.PARAM_SQL_DATABASE));
        Object obj = connParams.get(ConstantsSPI.PARAM_SQL_EXTRA_PARAMS);
        if(obj == null){
            connectDTO.setExtraParams(new HashMap<>());
        }else{
            connectDTO.setExtraParams((Map<String, Object>) obj);
        }
        return connectDTO;
    }

}
