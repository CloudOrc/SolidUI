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

from models.data_source import DataSource

def get(db: Session, id: int):
    return db.query(DataSource).filter(DataSource.id == id).first()

def get_by_name(db: Session, name: str):
    return db.query(DataSource).filter(DataSource.name == name).first()

def get_list(db: Session):
    return db.query(DataSource).all()

def create(db: Session, data_source: DataSource):
    db.add(data_source)
    db.commit()
    db.refresh(data_source)
    return data_source

def update(db: Session, data_source: DataSource):
    db.merge(data_source)
    db.commit()
    return data_source

def delete(db: Session, id: int):
    db.query(DataSource).filter(DataSource.id == id).delete()
    db.commit()
    return True