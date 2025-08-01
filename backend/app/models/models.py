# # models.py
# from sqlalchemy.orm import declarative_base
# from sqlalchemy import Column, Integer, String

# Base = declarative_base()

# # 例として1つテーブルを定義します
# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     email = Column(String, unique=True, index=True)

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

    courses = relationship("UserCourse", back_populates="user")


class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    role_name = Column(String)

    user_courses = relationship("UserCourse", back_populates="role")


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True)
    course_name = Column(String)

    users = relationship("UserCourse", back_populates="course")
    countries = relationship("CourseCountry", back_populates="course")


class UserCourse(Base):
    __tablename__ = "user_courses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))

    user = relationship("User", back_populates="courses")
    course = relationship("Course", back_populates="users")
    role = relationship("Role", back_populates="user_courses")


class Country(Base):
    __tablename__ = "countries"
    id = Column(Integer, primary_key=True)
    country_name = Column(String)

    course_countries = relationship("CourseCountry", back_populates="country")


class CourseCountry(Base):
    __tablename__ = "course_countries"
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    country_id = Column(Integer, ForeignKey("countries.id"))

    course = relationship("Course", back_populates="countries")
    country = relationship("Country", back_populates="course_countries")