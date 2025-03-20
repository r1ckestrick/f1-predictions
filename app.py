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

@app.route("/save_predictions", methods=["POST"])
def save_predictions():
    # Recibir datos del frontend
    data = request.json
    user_name = data.get("user")
    race = data.get("race")
    season = data.get("season")
    predictions = data.get("predictions", {})

    print("📩 Recibido en /save_predictions:", data)  # 👀 Ver qué se recibe

    # Buscar al usuario en la base de datos
    user = User.query.filter_by(name=user_name).first()
    if not user or not race or not season:
        return jsonify({"error": "Usuario, temporada y carrera son obligatorios"}), 400

    # Verificar si ya existe una predicción para este usuario y carrera
    existing_prediction = Prediction.query.filter_by(user_id=user.id, race=race).first()

    if existing_prediction:
        # Si existe, actualizar la predicción
        existing_prediction.pole = predictions.get("pole")
        existing_prediction.p1 = predictions.get("p1")
        existing_prediction.p2 = predictions.get("p2")
        existing_prediction.p3 = predictions.get("p3")
        existing_prediction.fastest_lap = predictions.get("fastest_lap")
        existing_prediction.most_overtakes = predictions.get("most_overtakes")
        existing_prediction.dnf = predictions.get("dnf")
        existing_prediction.driver_of_day = predictions.get("driver_of_day")
    else:
        # Si no existe, crear una nueva predicción
        new_prediction = Prediction(
            user_id=user.id,
            race=race,
            season=season,
            pole=predictions.get("pole"),
            p1=predictions.get("p1"),
            p2=predictions.get("p2"),
            p3=predictions.get("p3"),
            fastest_lap=predictions.get("fastest_lap"),
            most_overtakes=predictions.get("most_overtakes"),
            dnf=predictions.get("dnf"),
            driver_of_day=predictions.get("driver_of_day"),
        )
        db.session.add(new_prediction)  # Agregar la nueva predicción a la sesión

    # Guardar los cambios en la base de datos
    db.session.commit()

    return jsonify({"message": "Predicción guardada correctamente"})



    # Modelo de predicciones
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único de la predicción
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con el usuario
    race = db.Column(db.Integer, nullable=False)  # Número de la carrera
    pole = db.Column(db.String(50))  # Piloto en la pole position
    p1 = db.Column(db.String(50))  # Piloto en el primer lugar
    p2 = db.Column(db.String(50))  # Piloto en el segundo lugar
    p3 = db.Column(db.String(50))  # Piloto en el tercer lugar
    fastest_lap = db.Column(db.String(50))  # Piloto con la vuelta más rápida
    most_overtakes = db.Column(db.String(50))  # Piloto con más adelantamientos
    dnf = db.Column(db.String(50))  # Piloto que no terminó la carrera
    driver_of_day = db.Column(db.String(50))  # Piloto del día
    points = db.Column(db.Integer, default=0)  # Puntos obtenidos por la predicción

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
            for driver in data.get("MRData", {}).get("DriverTable", {}).get("Drivers", [])  # 💡 Se asegura que siempre sea una lista
         ]
        return jsonify({"drivers": drivers})  # ✅ Devuelve un array seguro
    
    return jsonify({"drivers": []}), 500  # 🚨 Retorna un array vacío en caso de error



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

#función que calcule y guarde los puntos después de cada carrera.
def calculate_points(prediction, race_results):
    """Calcula los puntos de una predicción en base a los resultados reales"""
    points = 0

    # Comparar cada predicción con los resultados reales
    if prediction.pole == race_results.get("pole"):
        points += 10
    if prediction.p1 == race_results.get("p1"):
        points += 10
    if prediction.p2 == race_results.get("p2"):
        points += 10
    if prediction.p3 == race_results.get("p3"):
        points += 10
    if prediction.fastest_lap == race_results.get("fastest_lap"):
        points += 10
    if prediction.most_overtakes == race_results.get("most_overtakes"):
        points += 10
    if prediction.dnf == race_results.get("dnf"):
        points += 10
    if prediction.driver_of_day == race_results.get("driver_of_day"):
        points += 10

    # Bonos
    podium = {race_results.get("p1"), race_results.get("p2"), race_results.get("p3")}
    predicted_podium = {prediction.p1, prediction.p2, prediction.p3}
    if podium == predicted_podium:
        points *= 2  # Bono por acertar el podio exacto

    prediction.points = points

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
@app.route('/get_predictions/<int:season>', methods=['GET'])
def get_predictions(season):
    predictions = Prediction.query.filter_by(season=season).all()  # ✅ Solo obtiene las del año
    results = []

    for prediction in predictions:
        user = User.query.get(prediction.user_id)
        results.append({
            "user": user.name,
            "season": season,  # 🔥 Asegúrate de devolver la temporada
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

# Obtener la última temporada disponible
@app.route('/get_latest_season', methods=['GET'])
def get_latest_season():
    url = "https://ergast.com/api/f1/seasons.json?limit=100"
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
            "race": pred.race,
            "season": pred.season,
            "pole": pred.pole,
            "p1": pred.p1,
            "p2": pred.p2,
            "p3": pred.p3,
            "fastest_lap": pred.fastest_lap,
            "most_overtakes": pred.most_overtakes,
            "dnf": pred.dnf,
            "driver_of_day": pred.driver_of_day,
            "points": pred.points
        }
        for pred in predictions
    ]
    
    return jsonify({"predictions": predictions_list})


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
    port = int(os.environ.get("PORT", 8080))  # Usa el puerto de Railway
    app.run(host='0.0.0.0', port=port, debug=False)  #  IMPORTANTE: debug=False


