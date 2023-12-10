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

from models.job_element_page import JobElementPage


def get(db: Session, id: int):
    return db.query(JobElementPage).filter(JobElementPage.id == id).first()


def get_by_element(db: Session, element_id: int):
    return db.query(JobElementPage).filter(JobElementPage.element_id == element_id).first()


def get_by_page(db: Session, page_id: int):
    return db.query(JobElementPage).filter(JobElementPage.page_id == page_id).all()


def get_list(db: Session):
    return db.query(JobElementPage).all()


def create(db: Session, page: JobElementPage):
    db_page = JobElementPage(
        page_id=page.page_id,
        element_id=page.element_id,
        position=page.position
    )
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page


def update(db: Session, page: JobElementPage):
    db_page = get(db, page.id)
    if db_page:
        db_page.page_id = page.page_id
        db_page.element_id = page.element_id
        db_page.position = page.position
        db.commit()
        return db_page
    else:
        return None


def delete(db: Session, id: int):
    db.query(JobElementPage).filter(JobElementPage.id == id).delete()
    db.commit()
    return True