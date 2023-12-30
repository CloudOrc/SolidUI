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
from solidui.entity.core import JobElement
from solidui.extensions import db


class JobElementDAO(BaseDAO[JobElement]):
    model_cls = JobElement

    @classmethod
    def delete_job_element_project_id(cls, project_id: int) -> None:
        db.session.query(JobElement).filter_by(project_id=project_id).delete()
        db.session.commit()

