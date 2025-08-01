# from sqlalchemy import Column, Integer, String, ForeignKey
# from sqlalchemy.orm import declarative_base, relationship

# Base = declarative_base()

# class Country(Base):
#     __tablename__ = 'countries'
#     id = Column(Integer, primary_key=True)
#     name = Column(String(100), unique=True, nullable=False)
#     regions = relationship("Region", back_populates="country")

# class Region(Base):
#     __tablename__ = 'regions'
#     id = Column(Integer, primary_key=True)
#     name = Column(String(100), nullable=False)
#     country_id = Column(Integer, ForeignKey('countries.id'), nullable=False)
#     country = relationship("Country", back_populates="regions")
#     emails = relationship("EmailAddress", back_populates="region")

# class EmailAddress(Base):
#     __tablename__ = 'email_addresses'
#     id = Column(Integer, primary_key=True)
#     email = Column(String(255), unique=True, nullable=False)
#     region_id = Column(Integer, ForeignKey('regions.id'), nullable=False)
#     region = relationship("Region", back_populates="emails")