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
    predictions = db.relationship('Prediction', backref='user', lazy=True)  # Relación con Prediction

# Permite CORS en todas las rutas
CORS(app, resources={r"/*": {"origins": "*"}})

# REVISAR SI ANDA EL RAILWAY
@app.route("/")
def home():
    return "Backend funcionando en Railway 🚀"

# ruta para guardar predicciones
@app.route("/save_predictions", methods=["POST"])
def save_predictions():
    data = request.json
    user_name = data.get("user")
    race = data.get("race")
    season = data.get("season")
    predictions = data.get("predictions", {})

 # 📌 LOGS para depurar
    print(f"📩 Recibido en /save_predictions: user={user_name}, race={race}, season={season}, predictions={predictions}")
    print(f"🔎 Predictions: {predictions}")  # 🔎 Verifica exactamente qué se está enviando

    # Validaciones
    if not user_name or not race or not season:
        return jsonify({"error": "Faltan datos obligatorios (usuario, carrera o temporada)"}), 400

    if not predictions:
        return jsonify({"error": "No se enviaron predicciones"}), 400

    user = User.query.filter_by(name=user_name).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    try:
        prediction = Prediction.query.filter_by(user_id=user.id, race=race, season=season).first()
        if prediction:
            # Solo sobrescribe si hay un valor nuevo, sino conserva el anterior
            prediction.pole = predictions.get("pole", prediction.pole)
            prediction.p1 = predictions.get("p1", prediction.p1)
            prediction.p2 = predictions.get("p2", prediction.p2)
            prediction.p3 = predictions.get("p3", prediction.p3)
            prediction.positions_gained = predictions.get("positions_gained", prediction.positions_gained)
            prediction.positions_lost = predictions.get("positions_lost", prediction.positions_lost)
            prediction.fastest_lap = predictions.get("fastest_lap", prediction.fastest_lap)
            prediction.dnf = predictions.get("dnf", prediction.dnf)
            prediction.best_of_the_rest = predictions.get("best_of_the_rest", prediction.best_of_the_rest)
            prediction.midfield_master = predictions.get("midfield_master", prediction.midfield_master)

            # Normaliza valores en mayúsculas si son strings
        for key, value in predictions.items():
            if isinstance(value, str):
                setattr(prediction, key, value.upper())

        else:
            # Crear nueva predicción
            prediction = Prediction(
                user_id=user.id,
                race=race,
                season=season,
                pole=predictions.get("pole", "").upper(),
                p1=predictions.get("p1", "").upper(),
                p2=predictions.get("p2", "").upper(),
                p3=predictions.get("p3", "").upper(),
                positions_gained=predictions.get("positions_gained", "").upper(),
                positions_lost=predictions.get("positions_lost", "").upper(),
                fastest_lap=predictions.get("fastest_lap", "").upper(),
                dnf=predictions.get("dnf", "").upper(),
                best_of_the_rest=predictions.get("best_of_the_rest", "").upper(),
                midfield_master=predictions.get("midfield_master", "").upper()
            )
            db.session.add(prediction)

        db.session.commit()
        print(f"✅ Predicción guardada correctamente: {prediction}")
        return jsonify({"message": "Predicción guardada correctamente"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"🚨 ERROR al guardar predicción: {str(e)}")
        return jsonify({"error": f"Error al guardar la predicción: {str(e)}"}), 500

    # Modelo de predicciones
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único de la predicción
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con el usuario
    season = db.Column(db.Integer, nullable=False)  # ← Asegúrate de agregar esta línea
    race = db.Column(db.Integer, nullable=False)  # Número de la carrera
    pole = db.Column(db.String(50))  # Piloto en la pole position
    p1 = db.Column(db.String(50))  # Piloto en el primer lugar
    p2 = db.Column(db.String(50))  # Piloto en el segundo lugar
    p3 = db.Column(db.String(50))  # Piloto en el tercer lugar
    positions_gained = db.Column(db.String(50))  # Piloto que subio mas en la grilla
    positions_lost = db.Column(db.String(50))  # Piloto que bajo mas en la grilla
    fastest_lap = db.Column(db.String(50))  # Piloto con la vuelta más rápida
    dnf = db.Column(db.String(50))  # Piloto que no terminó la carrera
    best_of_the_rest = db.Column(db.String(50)) # piloto en 4-6 lugar
    midfield_master =db.Column(db.String(50)) # piloto en 7-10 lufar
    points = db.Column(db.Integer, default=0)  # Puntos obtenidos por la predicción

# Crear la base de datos si no existe
with app.app_context():
    db.create_all()
    
    if not User.query.first():
        db.session.add(User(name="Renato"))
        db.session.add(User(name="Sebastian"))
        db.session.add(User(name="Enrique"))
        db.session.commit()
   
   # Buscar los drivers del grid
@app.route('/get_drivers/<year>', methods=['GET'])
def get_drivers(year):
    url = f"https://api.jolpi.ca/ergast/f1/{year}/drivers.json"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        drivers = [
            {"code": driver.get("code", driver["familyName"][:3].upper()), "name": f"{driver['givenName']} {driver['familyName']}"}
            for driver in data.get("MRData", {}).get("DriverTable", {}).get("Drivers", [])  # 💡 Se asegura que siempre sea una lista
         ]
        return jsonify({"drivers": drivers})  # ✅ Devuelve un array seguro
    
    return jsonify({"drivers": []}), 500  # 🚨 Retorna un array vacío en caso de error



#  **Ruta para obtener todas las carreras de una temporada**
@app.route('/get_all_races/<int:season>', methods=['GET'])
def get_all_races(season):
    url = f"https://api.jolpi.ca/ergast/f1/{season}.json"
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
        ranking.append({"name": user.name, "total_points": total_points or 0})  # Evita valores nulos
    
    ranking = sorted(ranking, key=lambda x: x["total_points"], reverse=True)
    return jsonify(ranking)

#  **Función para obtener resultados de una carrera**
def get_race_results(season, round):
    url = f"https://api.jolpi.ca/ergast/f1/{season}/{round}/results.json"
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

# modelo de calculo de puntaje
def calculate_points(prediction, race_results):
    """Calcula los puntos de una predicción en base a los resultados reales con la nueva lógica"""
    base_points = 40
    bonus_points = 50

    # Calcular aciertos básicos
    correct_picks = sum([
        prediction.pole == race_results.get("pole"),
        prediction.p1 == race_results.get("p1"),
        prediction.p2 == race_results.get("p2"),
        prediction.p3 == race_results.get("p3"),
        prediction.fastest_lap == race_results.get("fastest_lap"),
        prediction.dnf == race_results.get("dnf"),
        prediction.best_of_the_rest == race_results.get("best_of_the_rest"),
        prediction.midfield_master == race_results.get("midfield_master"),
    ])

    # Bonos
    podium_correct = {race_results.get("p1"), race_results.get("p2"), race_results.get("p3")}
    user_podium = {prediction.p1, prediction.p2, prediction.p3}
    udimpo = user_podium == podium_correct  # ✅ Acertó los 3 en desorden
    podium = user_podium == set([race_results.get("p1"), race_results.get("p2"), race_results.get("p3")])  # ✅ Acertó el orden exacto
    hat_trick = all([
        prediction.pole == race_results.get("pole"),
        prediction.p1 == race_results.get("p1"),
        prediction.fastest_lap == race_results.get("fastest_lap")
    ])
    bullseye = all([
        prediction.best_of_the_rest == race_results.get("best_of_the_rest"),
        prediction.midfield_master == race_results.get("midfield_master")
    ])
    
    # Contar bonos obtenidos
    active_bonuses = sum([udimpo, podium, hat_trick, bullseye])
    
    # Aplicar puntuación
    points = (correct_picks * base_points) + (active_bonuses * bonus_points)

    # Aplicar multiplicadores
    if active_bonuses == 2:
        points *= 1.1
    elif active_bonuses == 3:
        points *= 1.2
    elif active_bonuses == 4:
        points *= 1.3

    # Si obtiene OMEN (10 aciertos y todos los bonos), suma +200 puntos
    if correct_picks == 10 and active_bonuses == 4:
        points += 200

    prediction.points = int(points)
    return prediction.points  # Retorna el puntaje actualizado


# Ruta para Obtener Predicciones Guardadas
@app.route('/get_predictions/<int:season>', methods=['GET'])
def get_predictions(season):
    predictions = Prediction.query.filter_by(season=season).all()  # ✅ Solo obtiene las del año
    results = []

    for prediction in predictions:
        user = User.query.get(prediction.user_id)
        results.append({
            "user": user.name,
            "season": season,
            "race": prediction.race,
            "pole": prediction.pole,
            "p1": prediction.p1,
            "p2": prediction.p2,
            "p3": prediction.p3,
            "positions_gained": prediction.positions_gained,
            "positions_lost": prediction.positions_lost,
            "fastest_lap": prediction.fastest_lap,
            "dnf": prediction.dnf,
            "best_of_the_rest": prediction.best_of_the_rest,
            "midfield_master": prediction.midfield_master,
            "points": prediction.points
        })
    
    return jsonify({"predictions": results})

# ruta correcta para obtener los resultados de la carrera.
@app.route('/get_race_results/<int:season>/<int:round>', methods=['GET'])
def get_race_results(season, round):
    url = f"https://api.jolpi.ca/ergast/f1/{season}/{round}/results.json"
    response = requests.get(url)
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({"error": "No se pudieron obtener los resultados"}), 500

# Obtener la última temporada disponible
@app.route('/get_latest_season', methods=['GET'])
def get_latest_season():
    url = "https://api.jolpi.ca/ergast/f1/seasons.json?limit=100"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        seasons = data.get("MRData", {}).get("SeasonTable", {}).get("Seasons", [])
        latest_season = seasons[-1]["season"] if seasons else "2024"  # Fallback si no hay datos
        return jsonify({"latest_season": latest_season})
    
    return jsonify({"error": "No se pudo obtener la última temporada"}), 500

# Ruta para obtener las predicciones de una carrera específica
@app.route('/get_race_predictions/<int:season>/<int:round>', methods=['GET'])
def get_race_predictions(season, round):
    # 🔍 Buscar predicciones por temporada y número de carrera
    predictions = Prediction.query.filter_by(season=season, race=round).all()
    
    if not predictions:
        return jsonify({"error": "No hay predicciones para esta carrera"}), 404

    predictions_list = [
        {
            "user": User.query.get(pred.user_id).name,
            "season": pred.season,
            "race": pred.race,
            "pole": pred.pole,
            "p1": pred.p1,
            "p2": pred.p2,
            "p3": pred.p3,
            "positions_gained": pred.positions_gained,
            "positions_lost": pred.positions_lost,
            "fastest_lap": pred.fastest_lap,
            "dnf" : pred.dnf, 
            "best_of_the_rest" : pred.best_of_the_rest, 
            "midfield_master" : pred.midfield_master,
            "fastest_lap": pred.fastest_lap,
            "points": pred.points
        }
        for pred in predictions
    ]
    
    return jsonify({"predictions": predictions_list})


@app.route('/get_race_info/<int:season>/<int:round>', methods=['GET'])
def get_race_info(season, round):
    url = f"https://api.jolpi.ca/ergast/f1/{season}/{round}.json"
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
    port = int(os.environ.get("PORT", 8080))  # Usa el puerto de Railway
    app.run(host='0.0.0.0', port=port, debug=False)  #  IMPORTANTE: debug=False


