from sqlalchemy.orm import Session

from models.job_element_page import JobElementPage


def get(db: Session, id: int):
    return db.query(JobElementPage).filter(JobElementPage.id == id).first()


def get_by_element(db: Session, element_id: int):
    return db.query(JobElementPage).filter(JobElementPage.element_id == element_id).first()


def get_by_page(db: Session, page_id: int):
    return db.query(JobElementPage).filter(JobElementPage.page_id == page_id).all()


def get_list(db: Session):
    return db.query(JobElementPage).all()


def create(db: Session, page: JobElementPage):
    db_page = JobElementPage(
        page_id=page.page_id,
        element_id=page.element_id,
        position=page.position
    )
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page


def update(db: Session, page: JobElementPage):
    db_page = get(db, page.id)
    if db_page:
        db_page.page_id = page.page_id
        db_page.element_id = page.element_id
        db_page.position = page.position
        db.commit()
        return db_page
    else:
        return None


def delete(db: Session, id: int):
    db.query(JobElementPage).filter(JobElementPage.id == id).delete()
    db.commit()
    return True