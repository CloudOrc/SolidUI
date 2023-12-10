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

from models.project import Project


def get(db: Session, id: int):
    return db.query(Project).filter(Project.id == id).first()


def get_by_name(db: Session, name: str):
    return db.query(Project).filter(Project.name == name).first()


def get_list(db: Session, status: int):
    return db.query(Project).filter(Project.status == status).all()


def get_list_paginated(db: Session, page: int, search: str):
    query = db.query(Project)
    if search:
        query = query.filter(
            or_(Project.name.contains(search), Project.description.contains(search))
        )
    return query.paginate(page)


def create(db: Session, project: Project):
    db_project = Project(
        user_name=project.user_name,
        name=project.name,
        image=project.image,
        description=project.description
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update(db: Session, project: Project):
    db_project = get(db, project.id)
    if db_project:
        db_project.name = project.name
        db_project.description = project.description
        db.commit()
        return db_project
    else:
        return None


def delete(db: Session, id: int):
    db.query(Project).filter(Project.id == id).delete()
    db.commit()
    return True