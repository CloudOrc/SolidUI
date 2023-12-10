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

from models.job_element import JobElement


def get(db: Session, id: int):
    return db.query(JobElement).filter(JobElement.id == id).first()


def get_by_project(db: Session, project_id: int):
    return db.query(JobElement).filter(JobElement.project_id == project_id).all()


def get_list(db: Session):
    return db.query(JobElement).all()


def create(db: Session, element: JobElement):
    db_element = JobElement(
        project_id=element.project_id,
        name=element.name,
        data=element.data,
        data_type=element.data_type
    )
    db.add(db_element)
    db.commit()
    db.refresh(db_element)
    return db_element


def update(db: Session, element: JobElement):
    db_element = get(db, element.id)
    if db_element:
        db_element.name = element.name
        db_element.data = element.data
        db_element.data_type = element.data_type
        db.commit()
        return db_element
    else:
        return None


def delete(db: Session, id: int):
    db.query(JobElement).filter(JobElement.id == id).delete()
    db.commit()
    return True


def delete_by_project(db: Session, project_id: int):
    db.query(JobElement).filter(JobElement.project_id == project_id).delete()
    db.commit()
    return True