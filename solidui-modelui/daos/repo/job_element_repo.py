from sqlalchemy.orm import Session

from models.job_element import JobElement


def get(db: Session, id: int):
    return db.query(JobElement).filter(JobElement.id == id).first()


def get_by_project(db: Session, project_id: int):
    return db.query(JobElement).filter(JobElement.project_id == project_id).all()


def get_list(db: Session):
    return db.query(JobElement).all()


def create(db: Session, element: JobElement):
    db_element = JobElement(
        project_id=element.project_id,
        name=element.name,
        data=element.data,
        data_type=element.data_type
    )
    db.add(db_element)
    db.commit()
    db.refresh(db_element)
    return db_element


def update(db: Session, element: JobElement):
    db_element = get(db, element.id)
    if db_element:
        db_element.name = element.name
        db_element.data = element.data
        db_element.data_type = element.data_type
        db.commit()
        return db_element
    else:
        return None


def delete(db: Session, id: int):
    db.query(JobElement).filter(JobElement.id == id).delete()
    db.commit()
    return True


def delete_by_project(db: Session, project_id: int):
    db.query(JobElement).filter(JobElement.project_id == project_id).delete()
    db.commit()
    return True