from flask import Flask, jsonify
from flask_cors import CORS # N'oubliez pas l'importation de CORS pour la connexion React
from flask_sqlalchemy import SQLAlchemy
from models.Card import Card
from models.Set import Set

# Initialiser l'application Flask
app = Flask(__name__)
# Activer CORS pour permettre les requêtes depuis React (localhost:3000)
CORS(app) 

# --- Configuration de la Base de Données (SQLite) ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cardpokdex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app) 
# ----------------------------------------------------



# Définir votre première route API (endpoint)
@app.route('/')
def home():
    return "Bienvenue sur l'API Flask!"


@app.route('/api/cards', methods=['GET'])
def get_all_cards():
    cards = Card.query.all()
    return jsonify([card.to_dict() for card in cards])

@app.route('/api/sets', methods=['GET'])
def get_all_sets():
    sets = Set.query.all()
    return jsonify([set_item.to_dict() for set_item in sets])

@app.route('/api/card/<string:card_id>', methods=['GET'])
def get_card_details(card_id):
    """Récupère les détails d'une carte spécifique par son ID."""
    
    # Utilise l'ID pour interroger la base de données
    card = Card.query.get(card_id)
    
    # Si la carte n'est pas trouvée, renvoie une erreur 404
    if card is None:
        return jsonify({"message": f"Carte avec l'ID {card_id} non trouvée"}), 404
        
    # Renvoie les données au format JSON
    return jsonify(card.to_dict())

@app.route('/api/set/<string:set_id>', methods=['GET'])
def get_set_details(set_id):
    """Récupère les détails d'un set spécifique par son ID."""
    
    # Utilise l'ID pour interroger la base de données
    set_item = Set.query.get(set_id)
    
    # Si le set n'est pas trouvé, renvoie une erreur 404
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404
        
    # Renvoie les données au format JSON
    return jsonify(set_item.to_dict())

@app.route('/api/set/<string:set_id>/cards', methods=['GET'])
def get_cards_by_set(set_id):
    """Récupère toutes les cartes appartenant à un set spécifique par son ID."""
    
    # Vérifie si le set existe
    set_item = Set.query.get(set_id)
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404
    
    # Récupère toutes les cartes associées à ce set
    cards = Card.query.filter_by(set_id=set_id).all()
    
    # Renvoie les données au format JSON
    return jsonify([card.to_dict() for card in cards])

@app.route('/api/card/add', methods=['POST'])
def add_card():
    """Ajoute une nouvelle carte à la base de données."""
    from flask import request

    data = request.get_json()
    

    # Crée une nouvelle instance de Card avec les données reçues
    new_card = Card(
        id=data['id'],
        name=data['name'],
        supertype=data.get('supertype'),
        types=data.get('types'),
        number=data.get('number'),
        artist=data.get('artist'),
        rarity=data.get('rarity'),
        flavorText=data.get('flavorText'),
        small=data.get('small'),
        large=data.get('large'),
        set_id=data['set_id']
    )

    if Set.query.get(data['set_id']) is None:
        return jsonify({"message": f"Set avec l'ID {data['set_id']} non trouvé"}), 404

    # Ajoute la nouvelle carte à la session et commit
    db.session.add(new_card)
    db.session.commit()

    return jsonify({"message": "Carte ajoutée avec succès!"}), 201

@app.route('/api/set/add', methods=['POST'])
def add_set():
    """Ajoute un nouveau set à la base de données."""
    from flask import request

    data = request.get_json()
    
    # Vérifie si un set avec le même ID existe
    if 'id' in data and Set.query.get(data['id']) is not None:
        return jsonify({"message": f"Un set avec l'ID {data['id']} existe déjà"}), 409

    # Vérifie si un set avec le même nom existe
    if 'name' in data and Set.query.filter_by(name=data['name']).first() is not None:
        return jsonify({"message": f"Un set avec le nom '{data['name']}' existe déjà"}), 409

    # Crée une nouvelle instance de Set avec les données reçues
    new_set = Set(
        id=data['id'],
        name=data['name'],
        series=data.get('series'),
        total=data.get('total'),
        releaseDate=data.get('releaseDate'),
        logo=data.get('logo')
    )

    # Ajoute le nouveau set à la session et commit
    db.session.add(new_set)
    db.session.commit()

    return jsonify({"message": "Set ajouté avec succès!"}), 201


@app.route('/api/card/update/<string:card_id>', methods=['PUT'])
def update_card(card_id):
    """Met à jour les informations d'une carte existante."""
    from flask import request

    data = request.get_json()
    
    # Récupère la carte à mettre à jour
    card = Card.query.get(card_id)
    if card is None:
        return jsonify({"message": f"Carte avec l'ID {card_id} non trouvée"}), 404

    # Met à jour les champs de la carte
    card.name = data.get('name', card.name)
    card.supertype = data.get('supertype', card.supertype)
    card.types = data.get('types', card.types)
    card.number = data.get('number', card.number)
    card.artist = data.get('artist', card.artist)
    card.rarity = data.get('rarity', card.rarity)
    card.flavorText = data.get('flavorText', card.flavorText)
    card.small = data.get('small', card.small)
    card.large = data.get('large', card.large)
    card.set_id = data.get('set_id', card.set_id)

    # Commit les changements
    db.session.commit()

    return jsonify({"message": "Carte mise à jour avec succès!"})

@app.route('/api/set/update/<string:set_id>', methods=['PUT'])
def update_set(set_id):
    """Met à jour les informations d'un set existant."""
    from flask import request

    data = request.get_json()
    
    # Récupère le set à mettre à jour
    set_item = Set.query.get(set_id)
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404

    # Met à jour les champs du set
    set_item.name = data.get('name', set_item.name)
    set_item.series = data.get('series', set_item.series)
    set_item.total = data.get('total', set_item.total)
    set_item.releaseDate = data.get('releaseDate', set_item.releaseDate)
    set_item.logo = data.get('logo', set_item.logo)

    # Commit les changements
    db.session.commit()

    return jsonify({"message": "Set mis à jour avec succès!"})

@app.route('/api/card/delete/<string:card_id>', methods=['DELETE'])
def delete_card(card_id):
    """Supprime une carte de la base de données."""
    # Récupère la carte à supprimer
    card = Card.query.get(card_id)
    if card is None:
        return jsonify({"message": f"Carte avec l'ID {card_id} non trouvée"}), 404

    # Supprime la carte
    db.session.delete(card)
    db.session.commit()

    return jsonify({"message": "Carte supprimée avec succès!"})

@app.route('/api/set/delete/<string:set_id>', methods=['DELETE'])
def delete_set(set_id):
    """Supprime un set de la base de données."""
    # Récupère le set à supprimer
    set_item = Set.query.get(set_id)
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404

    # Supprime le set
    db.session.delete(set_item)
    db.session.commit()

    return jsonify({"message": "Set supprimé avec succès!"})

if __name__ == '__main__':
    # Lance l'application si vous l'exécutez directement avec `python app.py`
    app.run(debug=True)