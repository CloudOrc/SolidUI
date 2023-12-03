from sqlalchemy.orm import Session

from models.data_source_type import DataSourceType


def get(db: Session, id: int):
    return db.query(DataSourceType).filter(DataSourceType.id == id).first()


def get_by_name(db: Session, name: str):
    return db.query(DataSourceType).filter(DataSourceType.name == name).first()


def get_list(db: Session):
    return db.query(DataSourceType).all()


def create(db: Session, data_source_type: DataSourceType):
    db_dst = DataSourceType(
        name=data_source_type.name,
        description=data_source_type.description,
        option=data_source_type.option,
        classifier=data_source_type.classifier,
        icon=data_source_type.icon,
        layers=data_source_type.layers
    )
    db.add(db_dst)
    db.commit()
    db.refresh(db_dst)
    return db_dst


def update(db: Session, data_source_type: DataSourceType):
    db_dst = get(db, data_source_type.id)
    if db_dst:
        db_dst.name = data_source_type.name
        db_dst.description = data_source_type.description
        db_dst.option = data_source_type.option
        db_dst.classifier = data_source_type.classifier
        db_dst.icon = data_source_type.icon
        db_dst.layers = data_source_type.layers
        db.commit()
        return db_dst
    else:
        return None


def delete(db: Session, id: int):
    db.query(DataSourceType).filter(DataSourceType.id == id).delete()
    db.commit()
    return True