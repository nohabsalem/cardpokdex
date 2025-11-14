import re
from datetime import date, datetime
from app import app, db, Set, Card # Assurez-vous que les modèles sont importés
import os

# --- 1. Configuration et Nettoyage ---
SQL_FILE = 'cardpokdex.sql'
# On définit l'emplacement du fichier SQL par rapport au script
SQL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), SQL_FILE)

def parse_sql_values(values_str):
    """
    Parse une chaîne SQL de valeurs entre parenthèses en gérant correctement les guillemets.
    Exemple: ('val1', 'val2 with comma, inside', 'val3') -> ['val1', 'val2 with comma, inside', 'val3']
    """
    values = []
    current = ''
    in_quotes = False
    
    for char in values_str:
        if char == "'" and (not in_quotes or (len(values_str) > values_str.index(char) + 1 and values_str[values_str.index(char) + 1] != "'")):
            in_quotes = not in_quotes
        elif char == ',' and not in_quotes:
            values.append(current.strip().strip("'"))
            current = ''
            continue
        current += char
    
    if current.strip():
        values.append(current.strip().strip("'"))
    
    return values

def import_sql_data():
    """
    Lit le fichier SQL et insère les données des tables 'sets' et 'cards' dans la base de données Flask-SQLAlchemy.
    """
    print(f"Démarrage de l'importation depuis {SQL_FILE}...")
    
    # Assure que le contexte d'application est actif pour interagir avec la DB
    with app.app_context():
        # 1. Nettoyage initial : supprime toutes les données existantes
        print("Nettoyage des tables existantes...")
        db.drop_all()
        db.create_all() # Recréer les tables vides
        
        try:
            with open(SQL_PATH, 'r', encoding='utf8') as f:
                content = f.read()
        except FileNotFoundError:
            print(f"ERREUR: Le fichier SQL '{SQL_FILE}' est introuvable à l'emplacement: {SQL_PATH}")
            return

        # --- 2. Importation de la table 'sets' ---
        print("\nImportation des données des Sets...")
        
        # Regex pour capturer les inserts de la table `sets`
        # Capture toutes les valeurs entre VALUES (...) et la prochaine instruction ;
        sets_match = re.search(r'INSERT INTO `sets` \(`id`, `name`, `series`, `total`, `releaseDate`, `logo`\) VALUES\s*([\s\S]*?);', content)
        
        if sets_match:
            values_block = sets_match.group(1).strip()
            # Sépare les lignes d'insertion (...), (...), (...);
            raw_entries = re.findall(r'\((.*?)\)(?=[,;])', values_block)
            
            for entry in raw_entries:
                try:
                    values = parse_sql_values(entry)
                    
                    # Le premier élément d'une entrée est le 'id'
                    if len(values) >= 6:
                        id_ = values[0]
                        name = values[1]
                        series = values[2] if values[2] != 'NULL' else None
                        total = int(values[3]) if values[3] != 'NULL' else None
                        # Convertit la chaîne de date en objet date Python
                        release_date = datetime.strptime(values[4], '%Y-%m-%d').date() if values[4] != 'NULL' else None
                        logo = values[5] if values[5] != 'NULL' else None

                        new_set = Set(
                            id=id_,
                            name=name,
                            series=series,
                            total=total,
                            releaseDate=release_date,
                            logo=logo
                        )
                        db.session.add(new_set)
                        print(f"  Set ajouté: {name} ({id_})")
                except Exception as e:
                    print(f"Erreur d'insertion Set: {e} pour l'entrée: {entry}")
            
            db.session.commit()
            print(f"Sets importés : {db.session.query(Set).count()}")
        else:
            print("Aucune donnée 'sets' trouvée dans le fichier SQL.")

        # --- 3. Importation de la table 'cards' ---
        print("\nImportation des données des Cards...")

        # Regex pour capturer les inserts de la table `cards` (il y a plusieurs blocs)
        # Capture tous les blocs INSERT INTO `cards`... VALUES...
        cards_blocks = re.findall(r'INSERT INTO `cards` \(`id`, `name`, `supertype`, `types`, `number`, `artist`, `rarity`, `flavorText`, `small`, `large`\) VALUES\s*([\s\S]*?);', content)
        
        # Récupère tous les ID de set pour l'association
        set_ids = {s.id for s in db.session.query(Set.id).all()}

        total_cards_added = 0
        for block in cards_blocks:
            # Sépare les lignes d'insertion
            raw_entries = re.findall(r'\((.*?)\)(?=[,;])', block)
            
            for entry in raw_entries:
                try:
                    values = parse_sql_values(entry)

                    if len(values) >= 10:
                        id_ = values[0]
                        # Déduire le set_id à partir de l'ID de la carte (e.g., 'rsv10pt5-1' -> 'rsv10pt5')
                        set_id = id_.split('-')[0]
                        
                        if set_id in set_ids:
                            card = Card(
                                id=id_,
                                name=values[1],
                                supertype=values[2],
                                types=values[3],
                                number=int(values[4]) if values[4] != 'NULL' and values[4] else None,
                                artist=values[5] if values[5] != 'NULL' else None,
                                rarity=values[6] if values[6] != 'NULL' else None,
                                flavorText=values[7] if values[7] != 'NULL' else None,
                                small=values[8] if values[8] != 'NULL' else None,
                                large=values[9] if values[9] != 'NULL' else None,
                                set_id=set_id 
                            )
                            db.session.add(card)
                            total_cards_added += 1
                except Exception as e:
                    print(f"Erreur d'insertion Card: {e} pour l'entrée: {entry}")
        
        db.session.commit()
        print(f"Cartes importées : {total_cards_added}")
        print("\nImportation terminée avec succès!")


if __name__ == '__main__':
    import_sql_data()