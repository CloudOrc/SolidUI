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
from marshmallow_sqlalchemy.schema import Schema
from solidui.entity.core import Project
from marshmallow_sqlalchemy.fields import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class ProjectSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Project
        load_instance = True  # Optional: if you also want to use it for deserialization


class PageInfoSchema(Schema):
    current_page = fields.Int()
    page_size = fields.Int()
    total = fields.Int()
    total_page = fields.Int()
    total_list = fields.Nested(ProjectSchema, many=True)
