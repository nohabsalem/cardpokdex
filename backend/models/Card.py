from flask import Flask, jsonify
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

CORS(app) 


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cardpokdex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app) 

# --- Modèle de la Table 'cards' ---
class Card(db.Model):
    # La colonne `id` de la table SQL est longue (512), on la garde ainsi
    # On ajoute une colonne id auto-incrémentée si on veut une clé primaire simple, 
    # mais ici on utilise l'ID de la carte comme clé primaire car il est unique.
    
    # ID de la carte (Clé Primaire)
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

    # Clé étrangère: relie la carte à son set (colonne 'set_id')
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