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
import json
import logging
from datetime import datetime

from solidui.daos.job_element_page import JobElementPageDAO
from solidui.entity.core import JobElementPage, JobElement
from solidui.views.base_schemas import View, DataView, Data, Size, Position

logger = logging.getLogger(__name__)


def deep_copy_view_to_data_view(view: View) -> DataView:
    # Copy Position
    new_position = None
    if view.position is not None:
        new_position = Position(top=view.position.top, left=view.position.left)

    # Copy Size
    new_size = None
    if view.size is not None:
        new_size = Size(width=view.size.width, height=view.size.height)

    # Copy Data
    new_data = None
    if view.data is not None:
        new_data = Data(
            dataSourceId=view.data.dataSourceId,
            dataSourceName=view.data.dataSourceName,
            dataSourceTypeId=view.data.dataSourceTypeId,
            dataSourceTypeName=view.data.dataSourceTypeName,
            sql=view.data.sql,
            table=view.data.table
        )

    # Copy DataView
    data_view = DataView(position=new_position, size=new_size, options=view.options, data=new_data)

    return data_view


def save_job_element_page(page_id: int, job_element_id: int, size: Size) -> None:
    job_element_page = JobElementPage(
        job_page_id=page_id,
        job_element_id=job_element_id,
        position=json.dumps(size),
        create_time=datetime.now(),
        update_time=datetime.now()
    )
    JobElementPageDAO.create(item=job_element_page)


def create_job_element_page_vo(job_element: JobElement, views: list[View]) ->None:
    if not job_element:
        return

    view = View()
    view.id = job_element.id
    view.title = job_element.name
    view.type = job_element.dataType
    # Assuming JSONUtils is replaced with a Python JSON library
    data_view: DataView = json.loads(job_element.data)
    if not data_view:
        return

    view.position = data_view.position
    view.size = data_view.size
    view.options = data_view.options
    view.data = data_view.data
    views.append(view)
