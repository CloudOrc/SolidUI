from sqlalchemy.orm import Session

from models.project import Project


def get(db: Session, id: int):
    return db.query(Project).filter(Project.id == id).first()


def get_by_name(db: Session, name: str):
    return db.query(Project).filter(Project.name == name).first()


def get_list(db: Session, status: int):
    return db.query(Project).filter(Project.status == status).all()


def get_list_paginated(db: Session, page: int, search: str):
    query = db.query(Project)
    if search:
        query = query.filter(
            or_(Project.name.contains(search), Project.description.contains(search))
        )
    return query.paginate(page)


def create(db: Session, project: Project):
    db_project = Project(
        user_name=project.user_name,
        name=project.name,
        image=project.image,
        description=project.description
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update(db: Session, project: Project):
    db_project = get(db, project.id)
    if db_project:
        db_project.name = project.name
        db_project.description = project.description
        db.commit()
        return db_project
    else:
        return None


def delete(db: Session, id: int):
    db.query(Project).filter(Project.id == id).delete()
    db.commit()
    return True