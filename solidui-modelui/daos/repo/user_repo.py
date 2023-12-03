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