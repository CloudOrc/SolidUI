from sqlalchemy.orm import Session

from models.data_source import DataSource

def get(db: Session, id: int):
    return db.query(DataSource).filter(DataSource.id == id).first()

def get_by_name(db: Session, name: str):
    return db.query(DataSource).filter(DataSource.name == name).first()

def get_list(db: Session):
    return db.query(DataSource).all()

def create(db: Session, data_source: DataSource):
    db.add(data_source)
    db.commit()
    db.refresh(data_source)
    return data_source

def update(db: Session, data_source: DataSource):
    db.merge(data_source)
    db.commit()
    return data_source

def delete(db: Session, id: int):
    db.query(DataSource).filter(DataSource.id == id).delete()
    db.commit()
    return True