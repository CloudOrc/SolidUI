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

from __future__ import annotations

from solidui.daos.base import BaseDAO
from solidui.daos.exceptions import DAONotFound
from solidui.entity.core import JobPage
from solidui.extensions import db


class JobPageDAO(BaseDAO[JobPage]):
    model_cls = JobPage

    @classmethod
    def get_job_name(cls, name: str, project_id: int) -> JobPage:
        return db.session.query(JobPage).filter_by(name=name, project_id=project_id).first()

    @classmethod
    def get_job_page_project_ids(cls, project_id: int) -> list[JobPage]:
        return db.session.query(JobPage).filter_by(project_id=project_id).all()

    @classmethod
    def delete_project_id(cls, project_id: int) -> None:
        db.session.query(JobPage).filter_by(project_id=project_id).delete()
        db.session.commit()

    @classmethod
    def get_job_page_parent_ids(cls, parent_id: int) -> list[JobPage]:
        return db.session.query(JobPage).filter_by(parent_id=parent_id).all()

    @classmethod
    def delete_page_id(cls, pk: int) -> None:
        db.session.query(JobPage).filter_by(id=pk).delete()
        db.session.commit()
