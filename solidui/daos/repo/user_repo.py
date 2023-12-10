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

from models.user import User


def get(db: Session, id: int):
    return db.query(User).filter(User.id == id).first()


def get_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()


def get_by_credentials(db: Session, name: str, password: str):
    return db.query(User).filter(User.name == name, User.password == password).first()


def get_list(db: Session):
    return db.query(User).all()


def create(db: Session, user: User):
    db_user = User(
        name=user.name,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update(db: Session, user: User):
    db_user = get(db, user.id)
    if db_user:
        db_user.password = user.password
        db.commit()
        return db_user
    else:
        return None


def delete(db: Session, id: int):
    db.query(User).filter(User.id == id).delete()
    db.commit()
    return True