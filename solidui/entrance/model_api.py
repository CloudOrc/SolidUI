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


from flask import request
from services import ModelService
from exceptions import ApiException
from typing import List

from models import Model
from repositories import ModelRepository

class ModelController:

    def __init__(self, model_service: ModelService):
        self.service = model_service

    def get_models(self):
        try:
            models = self.service.get_models()
            return {
                'models': models
            }, 200
        except ApiException as e:
            return {'error': str(e)}, e.status_code




class ModelService:

    def __init__(self, model_repo: ModelRepository):
        self.model_repo = model_repo

    def get_models(self) -> List[Model]:
        models = self.model_repo.get_all()

        return [self._convert_to_output(m) for m in models]

    def _convert_to_output(self, model: Model) -> dict:
        return {
            'id': model.id,
            'name': f"{model.name}_{model.code}",
            'type': model.type
        }