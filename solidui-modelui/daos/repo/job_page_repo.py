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

from models.job_page import JobPage


def get(db: Session, id: int):
    return db.query(JobPage).filter(JobPage.id == id).first()


def get_by_name(db: Session, name: str, project_id: int):
    return db.query(JobPage).filter(JobPage.name == name, JobPage.project_id == project_id).first()


def get_by_project(db: Session, project_id: int):
    return db.query(JobPage).filter(JobPage.project_id == project_id).all()


def get_by_parent(db: Session, parent_id: int):
    return db.query(JobPage).filter(JobPage.parent_id == parent_id).all()


def get_list(db: Session):
    return db.query(JobPage).all()


def create(db: Session, page: JobPage):
    db_page = JobPage(
        project_id=page.project_id,
        name=page.name,
        orders=page.orders,
        parent_id=page.parent_id,
        layout=page.layout
    )
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page


def update(db: Session, page: JobPage):
    db_page = get(db, page.id)
    if db_page:
        db_page.name = page.name
        db_page.orders = page.orders
        db_page.parent_id = page.parent_id
        db_page.layout = page.layout
        db.commit()
        return db_page
    else:
        return None


def delete(db: Session, id: int):
    db.query(JobPage).filter(JobPage.id == id).delete()
    db.commit()
    return True


def delete_by_project(db: Session, project_id: int):
    db.query(JobPage).filter(JobPage.project_id == project_id).delete()
    db.commit()
    return True