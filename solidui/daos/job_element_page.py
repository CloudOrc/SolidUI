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
from solidui.entity.core import JobElementPage, JobPage
from solidui.extensions import db
from sqlalchemy import select


class JobElementPageDAO(BaseDAO[JobElementPage]):
    model_cls = JobElementPage

    @classmethod
    def get_job_element_page_id(cls, page_id: int) -> list[JobElementPage]:
        return db.session.query(JobElementPage).filter_by(job_page_id=page_id).all()

    @classmethod
    def delete_project_id(cls, project_id: int) -> None:
        # Create a subquery to find job_page_ids associated with the project_id
        subquery = select(JobPage.id).filter(JobPage.project_id == project_id).subquery()

        # Delete JobElementPage records where job_page_id is in the subquery results
        db.session.query(JobElementPage).filter(JobElementPage.job_page_id.in_(subquery)).delete(
            synchronize_session='fetch')
        db.session.commit()
