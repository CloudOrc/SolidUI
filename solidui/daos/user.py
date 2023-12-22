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
from solidui.entity.core import User
from sqlalchemy.orm import Session

class UserDao(BaseDAO[User]):
    @classmethod
    def queryUserByNamePassword(cls, session: Session, user_name: str, user_password: str) -> User:
        """To query a user based on their username and password."""
        return session.query(User).filter(
            User.user_name == user_name,
            User.user_password == user_password
        ).one_or_none()