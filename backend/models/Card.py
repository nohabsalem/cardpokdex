
from extensions import db
class Card(db.Model):
    id = db.Column(db.String(512), primary_key=True) 
    name = db.Column(db.String(512))
    supertype = db.Column(db.String(512))
    types = db.Column(db.String(512))
    number = db.Column(db.Integer)
    artist = db.Column(db.String(512))
    rarity = db.Column(db.String(512))
    flavorText = db.Column(db.String(512))
    small = db.Column(db.String(512))
    large = db.Column(db.String(512))

    set_id = db.Column(db.String(20), db.ForeignKey('set.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'supertype': self.supertype,
            'types': self.types,
            'number': self.number,
            'artist': self.artist,
            'rarity': self.rarity,
            'flavorText': self.flavorText,
            'small': self.small,
            'large': self.large,
            'set_id': self.set_id
        }