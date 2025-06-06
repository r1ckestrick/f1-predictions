from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
import requests
import os
import sys

# Define the API_URL
API_URL = os.getenv("API_URL", "http://localhost:5000")     

def force_print(*args, **kwargs):
    print(*args, **kwargs)
    sys.stdout.flush()  # ⬅️ Fuerza a que siempre se imprima sin importar el entorno

# Inicializar la aplicación Flask
app = Flask(__name__)

# Permite CORS en todas las rutas
CORS(app, resources={r"/*": {"origins": "*"}})

# Configurar base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
print(">>>>> BASE DE DATOS USADA:", app.config["SQLALCHEMY_DATABASE_URI"])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
from flask_migrate import Migrate
migrate = Migrate(app, db)

from datetime import datetime

def log(msg, emoji="ℹ️", color="default"):
    colors = {
        "default": "\033[0m",
        "gray": "\033[90m",
        "red": "\033[91m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "magenta": "\033[95m",
        "cyan": "\033[96m",
        "white": "\033[97m",
    }
    now = datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
    color_code = colors.get(color, colors["default"])
    reset_code = colors["default"]
    print(f"{now} {emoji} {color_code}{msg}{reset_code}")
    sys.stdout.flush()

#-------------------------SISTEMA DE RESULTADOS-------------------------#

@app.route('/get_race_results/<int:season>/<int:round>', methods=['GET'])
def get_race_results(season, round):
    url = f"https://api.jolpi.ca/ergast/f1/{season}/{round}/results.json"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "No se pudo obtener resultados"}), 500

    data = response.json()
    races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])

    if not races:
        return jsonify({"error": "No hay datos de esta carrera"}), 404

    results = races[0].get("Results", [])

    # ✅ RESULTADOS CLAVE
    race_results = {
        "pole": get_pole_position(results),
        "p1": get_position(results, 1),
        "p2": get_position(results, 2),
        "p3": get_position(results, 3),
        "fastest_lap": get_fastest_lap(results),
        "positions_gained": get_positions_gained(results),
        "positions_lost": get_positions_lost(results),
        "dnf": get_dnf(results),
        "best_of_the_rest": get_best_of_the_rest(results),
        "midfield_master": get_midfield_master(results)
    }

    return jsonify(race_results)

def get_pole_position(results):
    # Piloto que partió desde la pole (posición de grilla == 1)
    for r in results:
        if r.get("grid") == "1":
            return r["Driver"]["code"]
    return "N/A"

def get_position(results, pos):
    # Piloto que terminó en la posición pos (position == pos)
    for r in results:
        if r.get("position") == str(pos):
            return r["Driver"]["code"]
    return "N/A"



def get_fastest_lap(results):
    fastest = next((r for r in results if r.get("FastestLap", {}).get("rank") == "1"), None)
    return fastest["Driver"]["code"] if fastest else "N/A"

def get_positions_gained(results):
    """Quien subió más posiciones"""
    driver = max(
        results,
        key=lambda r: int(r.get("grid") or 0) - int(r.get("position") or 0),
        default=None
    )
    return driver["Driver"]["code"] if driver else None
def get_positions_lost(results):
    """Quien perdió más posiciones"""
    driver = min(
        results,
        key=lambda r: int(r.get("grid") or 0) - int(r.get("position") or 0),
        default=None
    )
    return driver["Driver"]["code"] if driver else None

def get_dnf(results):
    """Pilotos retirados"""
    return [r["Driver"]["code"] for r in results if r.get("status") == "Retired"]

def get_best_of_the_rest(results):
    """Pilotos posición 4, 5, 6"""
    return [r["Driver"]["code"] for r in results if r.get("position") and 4 <= int(r["position"]) <= 6]

def get_midfield_master(results):
    """Pilotos posición 7 a 10"""
    return [r["Driver"]["code"] for r in results if r.get("position") and 7 <= int(r["position"]) <= 10]

#-------------------------FIN DE RESULTADOS-------------------------#
#-------------------------CÁLCULO DE PUNTOS-------------------------#

def is_hit(pred_value, result_value):
    """Verifica si la predicción es correcta, incluso cuando el resultado es un array"""
    if result_value is None or pred_value is None:
        return False
    if isinstance(result_value, list):
        return pred_value in result_value
    return pred_value == result_value

def has_valid_predictions(prediction):
    fields = [
        prediction.pole,
        prediction.p1,
        prediction.p2,
        prediction.p3,
        prediction.positions_gained,
        prediction.positions_lost,
        prediction.fastest_lap,
        prediction.dnf,
        prediction.best_of_the_rest,
        prediction.midfield_master
    ]

    return any(
        str(field).strip().upper() not in ["", "-", "NONE"]
        for field in fields
    )

def calculate_points(prediction, race_results):
    if not prediction or not race_results:
        return {
            "points": 0,
            "bullseye": False,
            "hatTrick": False,
            "udimpo": False,
            "podium": False,
            "omen": False
        }

    # Puntos base por participar
    participation_points = 100 if has_valid_predictions(prediction) else 0

    # Calculamos los aciertos
    correct_picks = sum([
        is_hit(prediction.pole, race_results.get("pole")),
        is_hit(prediction.p1, race_results.get("p1")),
        is_hit(prediction.p2, race_results.get("p2")),
        is_hit(prediction.p3, race_results.get("p3")),
        is_hit(prediction.fastest_lap, race_results.get("fastest_lap")),
        is_hit(prediction.dnf, race_results.get("dnf")),
        is_hit(prediction.best_of_the_rest, race_results.get("best_of_the_rest")),
        is_hit(prediction.midfield_master, race_results.get("midfield_master")),
        is_hit(prediction.positions_gained, race_results.get("positions_gained")),
        is_hit(prediction.positions_lost, race_results.get("positions_lost")),
    ])

    # Bonos
    bullseye = all([
        is_hit(prediction.best_of_the_rest, race_results.get("best_of_the_rest")),
        is_hit(prediction.midfield_master, race_results.get("midfield_master"))
    ])
    hat_trick = all([
        is_hit(prediction.pole, race_results.get("pole")),
        is_hit(prediction.p1, race_results.get("p1")),
        is_hit(prediction.fastest_lap, race_results.get("fastest_lap"))
    ])
    udimpo = all([
        is_hit(prediction.p1, race_results.get("p1")) or is_hit(prediction.p1, race_results.get("p2")) or is_hit(prediction.p1, race_results.get("p3")),
        is_hit(prediction.p2, race_results.get("p1")) or is_hit(prediction.p2, race_results.get("p2")) or is_hit(prediction.p2, race_results.get("p3")),
        is_hit(prediction.p3, race_results.get("p1")) or is_hit(prediction.p3, race_results.get("p2")) or is_hit(prediction.p3, race_results.get("p3"))
    ])
    podium = all([
        is_hit(prediction.p1, race_results.get("p1")),
        is_hit(prediction.p2, race_results.get("p2")),
        is_hit(prediction.p3, race_results.get("p3"))
    ])
    omen = correct_picks == 10

    # Puntos por aciertos
    base_points = correct_picks * 10

    # Multiplicador
    multiplier = 1.0
    if bullseye:
        multiplier *= 1.5
    if hat_trick:
        multiplier *= 1.7
    if udimpo:
        multiplier *= 1.4
    if podium:
        multiplier *= 1.2

    # Puntos extra por omen
    omen_bonus = 200 if omen else 0

    # Total calculado
    total = round((participation_points + base_points) * multiplier + omen_bonus)
    total = min(max(total, 0), 1000)

    # LOG solo si estás en desarrollo
    if os.getenv("ENV") != "production":
        force_print(
            f"🧠 {prediction.user.name if hasattr(prediction, 'user') and prediction.user else prediction.user_id} → "
            f"Valid: {has_valid_predictions(prediction)} | Hits: {correct_picks}/10 | "
            f"HAT: {hat_trick} | POD: {podium} | BULL: {bullseye} | OMEN: {omen} | UDIMPO: {udimpo} | "
            f"Total: {total} pts"
        )

    # 🔁 Este return ahora se ejecuta SIEMPRE
    return {
        "points": total,
        "bullseye": bullseye,
        "hatTrick": hat_trick,
        "udimpo": udimpo,
        "podium": podium,
        "omen": omen
    }


#-------------------------FIN CÁLCULO DE PUNTOS-------------------------#
#-------------------------SISTEMA DE PREDICCIONES-------------------------#

# Función para obtener resultados de carrera internos
def get_race_results_internal(season, round):
    url = f"https://api.jolpi.ca/ergast/f1/{season}/{round}/results.json"
    response = requests.get(url)

    if response.status_code != 200:
        return None

    data = response.json()
    races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])

    if not races:
        return None

    results = races[0].get("Results", [])

    return {
        "pole": get_pole_position(results),
        "p1": get_position(results, 1),
        "p2": get_position(results, 2),
        "p3": get_position(results, 3),
        "fastest_lap": get_fastest_lap(results),
        "positions_gained": get_positions_gained(results),
        "positions_lost": get_positions_lost(results),
        "dnf": get_dnf(results),
        "best_of_the_rest": get_best_of_the_rest(results),
        "midfield_master": get_midfield_master(results)
    }


# Ruta para guardar predicciones
@app.route("/save_predictions", methods=["POST"])
def save_predictions():

    data = request.json
    user_name = data.get("user")
    race = int(data.get("race") or data.get("round") or 0) or None  # ✅ acepta race o round
    season = int(data.get("season")) if data.get("season") else None
    predictions = data.get("predictions", [])

    VALID_KEYS = {
        "pole", "p1", "p2", "p3",
        "positions_gained", "positions_lost",
        "fastest_lap", "dnf",
        "best_of_the_rest", "midfield_master"
    }

    if not predictions or not race or not season:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    # 💡 FLEXIBLE: aceptar dict o lista
    if isinstance(predictions, dict):
        predictions = [predictions]

    for pred in predictions:
        user_name = pred.get("user")
        if not user_name:
            return jsonify({"error": "Falta el nombre de usuario"}), 400

        pred_clean = {k: v for k, v in pred.items() if k in VALID_KEYS}
        if not pred_clean:
            return jsonify({"error": f"Predicción vacía para {user_name}"}), 400

        user = User.query.filter_by(name=user_name).first()
        if not user:
            return jsonify({"error": f"Usuario {user_name} no encontrado"}), 404

        prediction = Prediction.query.filter_by(user_id=user.id, race=race, season=season).first()
        if prediction:
            for key, value in pred_clean.items():
                if hasattr(prediction, key):
                    setattr(prediction, key, value.upper() if isinstance(value, str) else value)
        else:
            prediction = Prediction(
                user_id=user.id,
                race=race,
                season=season,
                **{k: (v.upper() if isinstance(v, str) else v) for k, v in pred_clean.items()}
            )
            db.session.add(prediction)

    try:
        race_results = get_race_results_internal(season, race)
        if not race_results:
            db.session.commit()
            return jsonify({"message": "Predicciones guardadas sin puntos"}), 200

        for pred in predictions:
            user = User.query.filter_by(name=pred["user"]).first()
            prediction = Prediction.query.filter_by(user_id=user.id, race=race, season=season).first()
            prediction.points = calculate_points(prediction, race_results)["points"]

        db.session.commit()
        return jsonify({"message": "Predicciones guardadas correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al guardar la predicción: {str(e)}"}), 500




#-------------------------FIN SISTEMA DE PREDICCIONES-------------------------#
#-------------------------MODELOS DE BASE DE DATOS-------------------------#

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
    points = db.Column(db.Integer, default=0, nullable=True)  # ✅ permite None

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

@app.route('/get_all_data/<int:season>', methods=['GET'])
def get_all_data(season):
    from threading import Thread

    # Lanzar recalculado en segundo plano
    Thread(target=recalculate_all_points, args=(season,)).start()

    # 1. Obtener última temporada oficial
    season_url = "https://api.jolpi.ca/ergast/f1/seasons.json?limit=100"
    season_response = requests.get(season_url)
    latest_season = "2024"
    if season_response.status_code == 200:
        seasons = season_response.json().get("MRData", {}).get("SeasonTable", {}).get("Seasons", [])
        latest_season = seasons[-1]["season"] if seasons else "2024"

    # 2. Obtener pilotos
    drivers_url = f"https://api.jolpi.ca/ergast/f1/{season}/drivers.json"
    drivers_response = requests.get(drivers_url)
    drivers = []
    if drivers_response.status_code == 200:
        for d in drivers_response.json().get("MRData", {}).get("DriverTable", {}).get("Drivers", []):
            code = d.get("code", d["familyName"][:3].upper())
            name = f"{d['givenName']} {d['familyName']}"
            drivers.append({"code": code, "name": name})

    # 3. Obtener carreras
    races_url = f"https://api.jolpi.ca/ergast/f1/{season}.json"
    races_response = requests.get(races_url)
    race_list = races_response.json().get("MRData", {}).get("RaceTable", {}).get("Races", []) if races_response.status_code == 200 else []
    races = [
        {"round": int(r["round"]), "raceName": r["raceName"], "date": r["date"]}
        for r in race_list
    ]

    # 4. Calcular leaderboard
    users = User.query.all()
    leaderboard = []
    for user in users:
        total = db.session.query(db.func.sum(Prediction.points)).filter_by(season=season, user_id=user.id).scalar()
        leaderboard.append({"name": user.name, "total_points": total or 0})
    leaderboard.sort(key=lambda x: x["total_points"], reverse=True)

    # 5. Calcular next y last race
    today = datetime.utcnow().date()
    next_race_info = None
    last_race_info = None
    for race in race_list:
        race_date = datetime.strptime(race["date"], "%Y-%m-%d").date()
        if race_date >= today and not next_race_info:
            next_race_info = race
        elif race_date < today:
            last_race_info = race

    return jsonify({
        "season": season,
        "latest_season": latest_season,
        "drivers": drivers,
        "races": races,
        "leaderboard": leaderboard,
        "next_race_info": next_race_info,
        "last_race_info": last_race_info
    })


# Ruta para obtener todas las temporadas disponibles
@app.route("/get_all_seasons")
def get_all_seasons():
    seasons = [2023, 2024, 2025, 2026]  # puedes cambiarlo por un query real si quieres
    return jsonify({"seasons": seasons})

#  Ruta para obtener todas las carreras de una temporada
@app.route('/get_all_races/<int:season>', methods=['GET'])
def get_all_races(season):
    url = f"https://api.jolpi.ca/ergast/f1/{season}.json"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        races = [
            {
                "round": race["round"],
                "raceName": race["raceName"],
                "date": race["date"],
            }
            for race in data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
        ]
        return jsonify({"races": races})
    return jsonify({"error": "No se pudieron obtener las carreras"}), 500   

# Buscar los drivers del grid
@app.route('/get_drivers/<year>', methods=['GET'])
def get_drivers(year):
    from data.driverStandings import driver_standings
    url = f"https://api.jolpi.ca/ergast/f1/{year}/drivers.json"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        drivers = []

        for driver in data.get("MRData", {}).get("DriverTable", {}).get("Drivers", []):
            code = driver.get("code", driver["familyName"][:3].upper())
            name = f"{driver['givenName']} {driver['familyName']}"
            team = driver_standings.get(code, {}).get("team", "unknown")  # <-- ¡aquí!

            drivers.append({ "code": code, "name": name, "team": team })

        print("🧪 DRIVERS CON TEAM:", drivers)  # <-- debug temporal
        return jsonify({"drivers": drivers})

    return jsonify({"drivers": []}), 500




#  Función para extraer datos clave de una carrera
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

# Ruta para Obtener Predicciones Guardadas
@app.route('/get_predictions/<int:season>', methods=['GET'])
def get_predictions(season):
    predictions = Prediction.query.filter_by(season=season).all()
    results = []

    for prediction in predictions:
        user = User.query.get(prediction.user_id)
        race_results = get_race_results_internal(prediction.season, prediction.race)

        bonus_data = calculate_points(prediction, race_results) if race_results else {
            "points": prediction.points or 0,
            "bullseye": False,
            "hatTrick": False,
            "udimpo": False,
            "podium": False,
            "omen": False
        }

        results.append({
            "user": user.name,
            "season": prediction.season,
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
            "points": bonus_data["points"],
            "bullseye": bonus_data["bullseye"],
            "hatTrick": bonus_data["hatTrick"],
            "udimpo": bonus_data["udimpo"],
            "podium": bonus_data["podium"],
            "omen": bonus_data["omen"]
        })

    return jsonify({"predictions": results})


# Ruta para obtener las predicciones de una carrera específica
@app.route('/get_race_predictions/<int:season>/<int:round>', methods=['GET'])
def get_race_predictions(season, round):
    predictions = Prediction.query.filter_by(season=season, race=round).all()

    if not predictions:
        print(f"🔔 No hay predicciones para {season}-{round}")
        return jsonify({"predictions": []}), 200

    # Intentar obtener resultados reales, pero no es obligatorio
    race_results = None
    try:
        response = requests.get(f"{API_URL}/get_race_results/{season}/{round}")
        if response.status_code == 200:
            race_results = response.json()
            if "error" in race_results:
                race_results = None
                print(f"⚠️ Carrera {season}-{round} sin resultados oficiales (carrera futura o no disponible)")
        else:
            print(f"⚠️ Carrera {season}-{round} sin resultados (API status {response.status_code})")
    except Exception as e:
        print(f"❌ Error al obtener resultados: {str(e)}")

    predictions_list = []

    for pred in predictions:
        bonus_data = calculate_points(pred, race_results) if race_results else {
            "points": pred.points or 0,
            "bullseye": False,
            "hatTrick": False,
            "udimpo": False,
            "podium": False,
            "omen": False
        }

        predictions_list.append({
            "user": User.query.get(pred.user_id).name,
            "season": pred.season,
            "race": pred.race,
            "pole": pred.pole,
            "p1": pred.p1,
            "p2": pred.p2,
            "p3": pred.p3,
            "positions_gained": pred.positions_gained,
            "positions_lost": pred.positions_lost,
            "dnf": pred.dnf,
            "best_of_the_rest": pred.best_of_the_rest,
            "midfield_master": pred.midfield_master,
            "fastest_lap": pred.fastest_lap,
            "points": bonus_data["points"],
            "bullseye": bonus_data["bullseye"],
            "hatTrick": bonus_data["hatTrick"],
            "udimpo": bonus_data["udimpo"],
            "podium": bonus_data["podium"],
            "omen": bonus_data["omen"]
        })

    return jsonify({"predictions": predictions_list})

#leaderboard por season
@app.route('/leaderboard/<int:season>', methods=['GET'])
def leaderboard_by_season(season):
    users = User.query.all()
    ranking = []
    for user in users:
        total_points = db.session.query(db.func.sum(Prediction.points)).filter(
            Prediction.user_id == user.id,
            Prediction.season == season
        ).scalar()
        ranking.append({"name": user.name, "total_points": total_points or 0})  # Evita valores nulos
    
    ranking = sorted(ranking, key=lambda x: x["total_points"], reverse=True)
    return jsonify(ranking)


# Información de la carrera 
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
                "season": season,
                "raceName": race.get("raceName", "Gran Premio Desconocido"),
                "round": race.get("round", round),
                "date": race.get("date", "Fecha no disponible"),
                "circuitName": circuit.get("circuitName", "Circuito Desconocido"),
                "location": f"{circuit.get('Location', {}).get('locality', 'Ubicación no disponible')}, {circuit.get('Location', {}).get('country', 'País no disponible')}",
                "FirstPractice": race.get("FirstPractice"),
                "SecondPractice": race.get("SecondPractice"),
                "ThirdPractice": race.get("ThirdPractice"),
                "Qualifying": race.get("Qualifying"),
                "Sprint": race.get("Sprint"),
                "SprintQualifying": race.get("SprintQualifying"),
                "time": race.get("time"),
            }
            return jsonify(race_info)

    return jsonify({"error": "No se pudo obtener la información de la carrera"}), 500

# Modelo de usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    predictions = db.relationship('Prediction', backref='user', lazy=True)  # Relación con Prediction

# Pre-carga de usuarios si no existen
if __name__ == "__main__":
    with app.app_context():
        if not User.query.first():
            db.session.add(User(name="Renato"))
            db.session.add(User(name="Sebastian"))
            db.session.add(User(name="Enrique"))
            db.session.commit()
        force_print("✅ Usuarios base creados")

@app.route('/recalculate_points/<int:season>/<int:round>', methods=['POST'])
def recalculate_points_for_race(season, round):
    updated = 0
    failed = []

    predictions = Prediction.query.filter_by(season=season, race=round).all()

    if not predictions:
        return jsonify({"message": "No hay predicciones para esta carrera"}), 200

    race_results = get_race_results_internal(season, round)
    if not race_results:
        return jsonify({"message": "La carrera no tiene resultados aún"}), 200

    for prediction in predictions:
        if prediction.points is not None:
            continue  # Ya calculados
        try:
            bonus_data = calculate_points(prediction, race_results)
            prediction.points = bonus_data["points"]
            updated += 1
        except Exception as e:
            failed.append({
                "user": prediction.user_id,
                "error": str(e)
            })

    try:
        db.session.commit()
        return jsonify({
            "message": f"Recalculadas {updated} predicciones",
            "errores": failed
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al guardar puntos recalculados: {str(e)}"}), 500
    
    
      

#-------------------------FIN MODELOS DE BASE DE DATOS-------------------------#


#  **Ejecutar la aplicación Flask**
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))  # usa 8080 por defecto
    app.run(host='0.0.0.0', port=port, debug=False)  #  IMPORTANTE: debug=False


