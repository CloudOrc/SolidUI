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

from models.data_source_type import DataSourceType


def get(db: Session, id: int):
    return db.query(DataSourceType).filter(DataSourceType.id == id).first()


def get_by_name(db: Session, name: str):
    return db.query(DataSourceType).filter(DataSourceType.name == name).first()


def get_list(db: Session):
    return db.query(DataSourceType).all()


def create(db: Session, data_source_type: DataSourceType):
    db_dst = DataSourceType(
        name=data_source_type.name,
        description=data_source_type.description,
        option=data_source_type.option,
        classifier=data_source_type.classifier,
        icon=data_source_type.icon,
        layers=data_source_type.layers
    )
    db.add(db_dst)
    db.commit()
    db.refresh(db_dst)
    return db_dst


def update(db: Session, data_source_type: DataSourceType):
    db_dst = get(db, data_source_type.id)
    if db_dst:
        db_dst.name = data_source_type.name
        db_dst.description = data_source_type.description
        db_dst.option = data_source_type.option
        db_dst.classifier = data_source_type.classifier
        db_dst.icon = data_source_type.icon
        db_dst.layers = data_source_type.layers
        db.commit()
        return db_dst
    else:
        return None


def delete(db: Session, id: int):
    db.query(DataSourceType).filter(DataSourceType.id == id).delete()
    db.commit()
    return True