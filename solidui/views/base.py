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
import json
import logging
import threading
import time
from datetime import datetime
from dataclasses import asdict
from solidui.common.constants import CLEAN_PERIOD
from solidui.daos.exceptions import DAODeleteFailedError
from solidui.daos.job_element import JobElementDAO
from solidui.daos.job_element_page import JobElementPageDAO
from solidui.daos.job_page import JobPageDAO
from solidui.daos.project import ProjectDAO
from solidui.entity.core import JobElementPage, JobElement, JobPage
from solidui.views.base_schemas import View, DataView, Data, Size, Position, JobPageDTO, JobElementPageVO, Page

logger = logging.getLogger(__name__)


def serialize_dataclass(dataclass_instance):
    """
    Serialize a dataclass instance to a dictionary, handling nested dataclasses.
    """
    if isinstance(dataclass_instance, list):
        return [serialize_dataclass(item) for item in dataclass_instance]
    elif hasattr(dataclass_instance, "__dict__"):
        return {k: serialize_dataclass(v) for k, v in asdict(dataclass_instance).items()}
    else:
        return dataclass_instance


def deep_copy_view_to_data_view(view: View):
    # Copy Position
    new_position = Position(**view.position) if isinstance(view.position, dict) else view.position

    # Copy Size
    new_size = Size(**view.size) if isinstance(view.size, dict) else view.size

    # Copy Data
    new_data = Data(**view.data) if isinstance(view.data, dict) else view.data

    # Copy DataView
    data_view = DataView(position=new_position, size=new_size, options=view.options, data=new_data)

    serialized_data_view = serialize_dataclass(data_view)

    return json.dumps(serialized_data_view, ensure_ascii=False)


def save_job_element_page(job_element_page_vo: JobElementPageVO, job_element_id: int) -> None:
    # page_id: int
    new_page = Page(**job_element_page_vo.page) if isinstance(job_element_page_vo.page,
                                                              dict) else job_element_page_vo.page
    # size: Size
    new_size = Size(**job_element_page_vo.size) if isinstance(job_element_page_vo.size,
                                                              dict) else job_element_page_vo.size

    serialized_size = serialize_dataclass(new_size)

    job_element_page = JobElementPage(
        job_page_id=new_page.id,
        job_element_id=job_element_id,
        position=json.dumps(serialized_size, ensure_ascii=False),
        create_time=datetime.now(),
        update_time=datetime.now()
    )
    JobElementPageDAO.create(item=job_element_page)


def create_job_element_page_vo(job_element: JobElement, views: list[View]) -> None:
    if not job_element:
        return

    view = View()
    view.id = job_element.id
    view.title = job_element.name
    view.type = job_element.data_type
    # Assuming JSONUtils is replaced with a Python JSON library
    data_view_dict = json.loads(job_element.data)
    if not data_view_dict:
        return

    data_view = DataView(
        position=Position(**data_view_dict['position']) if 'position' in data_view_dict else None,
        size=Size(**data_view_dict['size']) if 'size' in data_view_dict else None,
        options=data_view_dict.get('options'),
        data=Data(**data_view_dict['data']) if 'data' in data_view_dict else None
    )

    view.position = data_view.position
    view.size = data_view.size
    view.options = data_view.options
    view.data = data_view.data
    views.append(view)


def convert_to_dto(job_page: JobPage):
    # Assuming JobPage has attributes like id, project_id, name, etc.
    # and JobPageDTO has a constructor that accepts these attributes.
    job_page_dto = JobPageDTO(
        id=job_page.id,
        project_id=job_page.project_id,
        name=job_page.name,
        parent_id=job_page.parent_id,
        layout=job_page.layout,
        create_time=job_page.create_time,
        update_time=job_page.update_time,
        orders=job_page.orders,
        children=[]  # Initially empty, to be filled later if needed
    )
    return job_page_dto


def schedule_clean_job_element_page():
    thread = threading.Timer(CLEAN_PERIOD / 1000 / 10, clean_job_element_page_task)
    thread.daemon = True
    thread.start()


def clean_job_element_page_task():
    try:
        clean_job_element_page()
    except DAODeleteFailedError as e:
        logger.error(f"Error cleaning job element page : {e}")
    thread = threading.Timer(CLEAN_PERIOD / 1000 / 10, clean_job_element_page_task)
    thread.daemon = True
    thread.start()


def clean_job_element_page():
    """
    Clean job element pages for projects.
    """
    projects = ProjectDAO.get_project_list(1)
    if projects:
        for project in projects:
            JobElementPageDAO.delete_project_id(project.id)
            logger.info(f"cleanJobElementPage delete_project_id projectId: {project.id}")

            JobElementDAO.delete_job_element_project_id(project.id)
            logger.info(f"cleanJobElementPage delete_job_element_project_id projectId: {project.id}")
            # Delete associated records
            JobPageDAO.delete_project_id(project.id)
            logger.info(f"cleanJobElementPage delete_project_id projectId: {project.id}")

            ProjectDAO.delete(project)
            logger.info(f"cleanJobElementPage projectId: {project.id}")
