from app import db, Prediction, app

# Asegura que estamos en el contexto de la aplicación
with app.app_context():
    # ✅ Crear tablas si no existen
    db.create_all()
    
    try:
        print("🔄 Cerrando conexiones y eliminando predicciones...")

        db.session.close()  # Cierra la sesión de la BD
        db.engine.dispose()  # Cierra la conexión con la BD

        # Elimina todas las predicciones
        num_deleted = db.session.query(Prediction).delete()
        db.session.commit()

        print(f"✅ Se eliminaron {num_deleted} predicciones correctamente.")

        # Verifica cuántas quedan
        remaining = db.session.query(Prediction).count()
        print(f"📊 Predicciones restantes en la BD: {remaining}")

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error al eliminar predicciones: {e}")

