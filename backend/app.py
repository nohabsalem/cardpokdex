from flask import Flask, jsonify, request
from flask_cors import CORS
from extensions import db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cardpokdex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
from models.Card import Card
from models.Set import Set

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Bienvenue sur l'API Flask!"

@app.route('/api/cards', methods=['GET'])
def get_all_cards():
    cards = Card.query.all()
    return jsonify([card.to_dict() for card in cards]), 200

@app.route('/api/sets', methods=['GET'])
def get_all_sets():
    sets = Set.query.all()
    return jsonify([set_item.to_dict() for set_item in sets]), 200

@app.route('/api/card/<string:card_id>', methods=['GET'])
def get_card_details(card_id):
    card = Card.query.get(card_id)
    if card is None:
        return jsonify({"message": f"Carte avec l'ID {card_id} non trouvée"}), 404
    return jsonify(card.to_dict()), 200

@app.route('/api/search', methods=['GET'])
def search_cards():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify([])
    try:
        results = Card.query.filter(Card.name.ilike(f"%{q}%")).all()
    except Exception:
        results = []
    return jsonify([card.to_dict() for card in results])

@app.route('/api/set/<string:set_id>', methods=['GET'])
def get_set_details(set_id):
    set_item = Set.query.get(set_id)
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404
    return jsonify(set_item.to_dict()), 200

@app.route('/api/set/<string:set_id>/cards', methods=['GET'])
def get_cards_by_set(set_id):
    set_item = Set.query.get(set_id)
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404
    cards = Card.query.filter_by(set_id=set_id).all()
    return jsonify([card.to_dict() for card in cards]), 200

@app.route('/api/card/add', methods=['POST'])
def add_card():
    from flask import request
    data = request.get_json()
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
    db.session.add(new_card)
    db.session.commit()
    return jsonify({"message": "Carte ajoutée avec succès!"}), 201

@app.route('/api/set/add', methods=['POST'])
def add_set():
    from flask import request
    data = request.get_json()
    if 'id' in data and Set.query.get(data['id']) is not None:
        return jsonify({"message": f"Un set avec l'ID {data['id']} existe déjà"}), 409
    if 'name' in data and Set.query.filter_by(name=data['name']).first() is not None:
        return jsonify({"message": f"Un set avec le nom '{data['name']}' existe déjà"}), 409
    new_set = Set(
        id=data['id'],
        name=data['name'],
        series=data.get('series'),
        total=data.get('total'),
        releaseDate=data.get('releaseDate'),
        logo=data.get('logo')
    )
    db.session.add(new_set)
    db.session.commit()
    return jsonify({"message": "Set ajouté avec succès!"}), 201

@app.route('/api/card/update/<string:card_id>', methods=['PUT'])
def update_card(card_id):
    from flask import request
    data = request.get_json()
    card = Card.query.get(card_id)
    if card is None:
        return jsonify({"message": f"Carte avec l'ID {card_id} non trouvée"}), 404
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
    db.session.commit()
    return jsonify({"message": "Carte mise à jour avec succès!"}), 200

@app.route('/api/set/update/<string:set_id>', methods=['PUT'])
def update_set(set_id):
    from flask import request
    data = request.get_json()
    set_item = Set.query.get(set_id)
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404
    set_item.name = data.get('name', set_item.name)
    set_item.series = data.get('series', set_item.series)
    set_item.total = data.get('total', set_item.total)
    set_item.releaseDate = data.get('releaseDate', set_item.releaseDate)
    set_item.logo = data.get('logo', set_item.logo)
    db.session.commit()
    return jsonify({"message": "Set mis à jour avec succès!"}), 200

@app.route('/api/card/delete/<string:card_id>', methods=['DELETE'])
def delete_card(card_id):
    card = Card.query.get(card_id)
    if card is None:
        return jsonify({"message": f"Carte avec l'ID {card_id} non trouvée"}), 404
    db.session.delete(card)
    db.session.commit()
    return jsonify({"message": "Carte supprimée avec succès!"}), 200

@app.route('/api/set/delete/<string:set_id>', methods=['DELETE'])
def delete_set(set_id):
    set_item = Set.query.get(set_id)
    if set_item is None:
        return jsonify({"message": f"Set avec l'ID {set_id} non trouvé"}), 404
    db.session.delete(set_item)
    db.session.commit()
    return jsonify({"message": "Set supprimé avec succès!"}), 200

if __name__ == '__main__':
    app.run(debug=True)