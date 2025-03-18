from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import requests
import os

# Inicializar la aplicación Flask
app = Flask(__name__)
CORS(app)  # Esto habilita CORS en toda la app

# Configurar base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///f1_predictions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

# Permite CORS en todas las rutas
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/save_predictions", methods=["POST"])
def save_predictions():
    data = request.json
    print("📩 Recibido en /save_predictions:", data)  # 👀 Ver qué se recibe

    user = User.query.filter_by(name=data["user"]).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 400

    race_id = data.get("race")
    if race_id is None:
        return jsonify({"error": "race_id is missing"}), 400

    # 🔍 Buscar si ya existe una predicción para este usuario y carrera
    existing_prediction = Prediction.query.filter_by(user_id=user.id, race=race_id).first()

    if existing_prediction:
        print(f"♻️ Actualizando predicción existente para {user.name} en carrera {race_id}")
        # Mantener valores previos si no se envía un nuevo dato
        existing_prediction.pole = data["predictions"].get("pole")
        existing_prediction.p1 = data["predictions"].get("p1")
        existing_prediction.p2 = data["predictions"].get("p2")
        existing_prediction.p3 = data["predictions"].get("p3")
        existing_prediction.fastest_lap = data["predictions"].get("fastest_lap")
        existing_prediction.most_overtakes = data["predictions"].get("most_overtakes")
        existing_prediction.dnf = data["predictions"].get("dnf")
        existing_prediction.driver_of_day = data["predictions"].get("driver_of_day")
    else:
        print(f"🆕 Creando nueva predicción para {user.name} en carrera {race_id}")
        # Si no existe, creamos una nueva predicción
        existing_prediction = Prediction(
            user_id=user.id,
            race=race_id,
            pole=data["predictions"].get("pole"),
            p1=data["predictions"].get("p1"),
            p2=data["predictions"].get("p2"),
            p3=data["predictions"].get("p3"),
            fastest_lap=data["predictions"].get("fastest_lap"),
            most_overtakes=data["predictions"].get("most_overtakes"),
            dnf=data["predictions"].get("dnf"),
            driver_of_day=data["predictions"].get("driver_of_day"),
        )
        db.session.add(existing_prediction)  # Solo agregamos si es nuevo

    db.session.commit()
    print(f"✅ Predicción guardada correctamente para {user.name} en carrera {race_id}")
    return jsonify({"message": "Predicción guardada correctamente"})



# Modelo de predicciones
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    race = db.Column(db.String(100), nullable=False)
    race = db.Column(db.Integer, nullable=False)  # <- Asegúrate de que existe
    pole = db.Column(db.String(50))
    p1 = db.Column(db.String(50))
    p2 = db.Column(db.String(50))
    p3 = db.Column(db.String(50))
    fastest_lap = db.Column(db.String(50))
    most_overtakes = db.Column(db.String(50))
    dnf = db.Column(db.String(50))
    driver_of_day = db.Column(db.String(50))
    points = db.Column(db.Integer, default=0)

# Crear la base de datos si no existe
with app.app_context():
    db.create_all()
    
    if not User.query.first():
        db.session.add(User(name="Renato"))
        db.session.add(User(name="Sebastian"))
        db.session.add(User(name="Enrique"))
        db.session.commit()

#  **Ruta para guardar predicciones**
@app.route('/submit_prediction', methods=['POST'])
def submit_prediction():
    data = request.json  # Recibir datos del frontend

    # Buscar el usuario en la base de datos
    user = User.query.filter_by(name=data["user"]).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Crear una nueva predicción
    prediction = Prediction(
        user_id=user.id,
        race=data["race"],
        pole=data["pole"],
        p1=data["p1"],
        p2=data["p2"],
        p3=data["p3"],
        fastest_lap=data["fastest_lap"],
        most_overtakes=data["most_overtakes"],
        dnf=data["dnf"],
        driver_of_day=data["driver_of_day"]
    )

    # Guardar en la base de datos
    db.session.add(prediction)
    db.session.commit()

    return jsonify({"message": "Predicción guardada con éxito!"}), 201
   
   # Buscar los drivers del grid
@app.route('/get_drivers/<year>', methods=['GET'])
def get_drivers(year):
    url = f"http://ergast.com/api/f1/{year}/drivers.json"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        drivers = [
            {"code": driver.get("code", driver["familyName"][:3].upper()), "name": f"{driver['givenName']} {driver['familyName']}"}
            for driver in data["MRData"]["DriverTable"]["Drivers"]
        ]
        return jsonify({"drivers": drivers})
    
    return jsonify({"error": "No se pudo obtener la lista de pilotos"}), 500

#  **Ruta para obtener todas las carreras de una temporada**
@app.route('/get_all_races/<int:season>', methods=['GET'])
def get_all_races(season):
    url = f"https://ergast.com/api/f1/{season}.json"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        races = [
            {
                "round": race["round"],
                "raceName": race["raceName"]
            }
            for race in data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
        ]
        return jsonify({"races": races})
    return jsonify({"error": "No se pudieron obtener las carreras"}), 500

#  **Ruta para ver el ranking de jugadores**
@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    users = User.query.all()
    ranking = []
    for user in users:
        total_points = db.session.query(db.func.sum(Prediction.points)).filter(Prediction.user_id == user.id).scalar()
        ranking.append({"name": user.name, "total_points": total_points or 0})
    
    ranking = sorted(ranking, key=lambda x: x["total_points"], reverse=True)
    return jsonify(ranking)

#  **Función para obtener resultados de una carrera**
def get_race_results(season, round):
    url = f"https://ergast.com/api/f1/{season}/{round}/results.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None

#  **Función para extraer datos clave de una carrera**
def extract_race_summary(results):
    race_data = results.get('MRData', {}).get('RaceTable', {}).get('Races', [{}])[0]

    summary = {
        "circuit": race_data.get('Circuit', {}).get('circuitName', "Unknown"),
        "location": race_data.get('Circuit', {}).get('Location', {}).get('country', "Unknown"),
        "winner": race_data.get('Results', [{}])[0].get('Driver', {}).get('code', "N/A"),
        "pole_position": race_data.get('Results', [{}])[0].get('Driver', {}).get('code', "N/A"),
        "fastest_lap": None,
        "most_overtakes": None
    }

    # Buscar la vuelta más rápida
    for driver in race_data.get('Results', []):
        if 'FastestLap' in driver:
            summary["fastest_lap"] = driver['Driver']['code']
            break

    # Calcular el piloto con más adelantamientos
    overtakes = {}
    for driver in race_data.get('Results', []):
        start_pos = int(driver.get('grid', 0))
        finish_pos = int(driver.get('position', 0))
        name = driver.get('Driver', {}).get('code', "N/A")
        overtakes[name] = start_pos - finish_pos
    summary["most_overtakes"] = max(overtakes, key=overtakes.get, default="N/A")
    
    return summary

# Ruta para Obtener Predicciones Guardadas
@app.route('/get_predictions', methods=['GET'])
def get_predictions():
    predictions = Prediction.query.all()
    results = []
    
    for prediction in predictions:
        user = User.query.get(prediction.user_id)
        results.append({
            "user": user.name,
            "race": prediction.race,
            "pole": prediction.pole,
            "p1": prediction.p1,
            "p2": prediction.p2,
            "p3": prediction.p3,
            "fastest_lap": prediction.fastest_lap,
            "most_overtakes": prediction.most_overtakes,
            "dnf": prediction.dnf,
            "driver_of_day": prediction.driver_of_day,
            "points": prediction.points
        })
    
    return jsonify({"predictions": results})

# ruta correcta para obtener los resultados de la carrera.
@app.route('/get_race_results/<int:season>/<int:round>', methods=['GET'])
def get_race_results(season, round):
    url = f"https://ergast.com/api/f1/{season}/{round}/results.json"
    response = requests.get(url)
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({"error": "No se pudieron obtener los resultados"}), 500

# Ruta para obtener las predicciones de una carrera específica
@app.route('/get_race_predictions/<int:season>/<int:round>', methods=['GET'])
def get_race_predictions(season, round):
    # Buscar el nombre de la carrera correspondiente al número de ronda
    races_response = requests.get(f"https://ergast.com/api/f1/{season}.json")
    if races_response.status_code != 200:
        return jsonify({"error": "No se pudieron obtener las carreras"}), 500
    
    races_data = races_response.json()
    races = races_data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
    
    race_name = None
    for race in races:
        if race["round"] == str(round):  # Convertimos a string para comparación
            race_name = race["raceName"]
            break
    
    if not race_name:
        return jsonify({"error": "No se encontró la carrera"}), 404
    
    # Buscar predicciones en la base de datos por nombre de carrera
    predictions = Prediction.query.filter_by(race=race_name).all()
    
    if not predictions:
        return jsonify({"error": "No hay predicciones para esta carrera"}), 404

    predictions_list = [
        {
            "user": User.query.get(pred.user_id).name,
            "pole": pred.pole,
            "p1": pred.p1,
            "p2": pred.p2,
            "p3": pred.p3,
            "fastest_lap": pred.fastest_lap,
            "most_overtakes": pred.most_overtakes,
            "dnf": pred.dnf,
            "driver_of_day": pred.driver_of_day,
        }
        for pred in predictions
    ]
    
    return jsonify({"predictions": predictions_list})
#  **buscar info carrera**


@app.route('/get_race_info/<int:season>/<int:round>', methods=['GET'])
def get_race_info(season, round):
    url = f"https://ergast.com/api/f1/{season}/{round}.json"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])

        if races:
            race = races[0]  # Tomamos la primera carrera encontrada
            circuit = race.get("Circuit", {})

            race_info = {
                "raceName": race.get("raceName", "Gran Premio Desconocido"),
                "round": race.get("round", round),
                "date": race.get("date", "Fecha no disponible"),
                "circuitName": circuit.get("circuitName", "Circuito Desconocido"),
                "location": f"{circuit.get('Location', {}).get('locality', 'Ubicación no disponible')}, {circuit.get('Location', {}).get('country', 'País no disponible')}",
                "map": f"http://en.wikipedia.org/wiki/{circuit.get('circuitName', '').replace(' ', '_')}",
                "mapImage": f"https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/{circuit.get('circuitName', '').replace(' ', '_')}--Grand_Prix_Layout.svg/800px-{circuit.get('circuitName', '').replace(' ', '_')}--Grand_Prix_Layout.svg.png"
            }
            return jsonify(race_info)

    return jsonify({"error": "No se pudo obtener la información de la carrera"}), 500

#  **Ejecutar la aplicación Flask**
if __name__ == '__main__':
    app.run(debug=True)
