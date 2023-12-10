#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
# http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
from sqlalchemy.orm import Session

from models.data_source_param_key import DataSourceParamKey


def get(db: Session, id: int):
    return db.query(DataSourceParamKey).filter(DataSourceParamKey.id == id).first()


def get_by_type(db: Session, type_id: int):
    return db.query(DataSourceParamKey).filter(DataSourceParamKey.type_id == type_id).all()


def get_list(db: Session):
    return db.query(DataSourceParamKey).all()


def create(db: Session, param_key: DataSourceParamKey):
    db_param = DataSourceParamKey(
        type_id=param_key.type_id,
        key=param_key.key,
        name=param_key.name,
        name_en=param_key.name_en,
        default_value=param_key.default_value,
        value_type=param_key.value_type,
        scope=param_key.scope,
        require=param_key.require,
        description=param_key.description,
        description_en=param_key.description_en,
        value_regex=param_key.value_regex
    )
    db.add(db_param)
    db.commit()
    db.refresh(db_param)
    return db_param


def update(db: Session, param_key: DataSourceParamKey):
    db_param = get(db, param_key.id)
    if db_param:
        db_param.key = param_key.key
        db_param.name = param_key.name
        db_param.name_en = param_key.name_en
        db_param.default_value = param_key.default_value
        db_param.value_type = param_key.value_type
        db_param.scope = param_key.scope
        db_param.require = param_key.require
        db_param.description = param_key.description
        db_param.description_en = param_key.description_en
        db_param.value_regex = param_key.value_regex
        db.commit()
        return db_param
    else:
        return None


def delete(db: Session, id: int):
    db.query(DataSourceParamKey).filter(DataSourceParamKey.id == id).delete()
    db.commit()
    return True