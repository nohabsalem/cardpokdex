from extensions import db
class Set(db.Model):
    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    series = db.Column(db.String(100))
    total = db.Column(db.Integer)
    releaseDate = db.Column(db.Date)
    logo = db.Column(db.String(255))

    cards = db.relationship('Card', backref='set', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'series': self.series,
            'total': self.total,
            'releaseDate': str(self.releaseDate),
            'logo': self.logo
        }
  