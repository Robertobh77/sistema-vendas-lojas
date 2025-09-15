import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.config import Config
from src.routes.lojas import lojas_bp
from src.routes.operadores import operadores_bp
from src.routes.operadores_dashboard import operadores_dashboard_bp
from src.routes.vendas import vendas_bp
from src.routes.upload import upload_bp
from src.routes.upload_simples import upload_simples_bp
from src.routes.auth import auth_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config.from_object(Config)

# Habilitar CORS para todas as rotas
CORS(app)

# Registrar blueprints
app.register_blueprint(lojas_bp, url_prefix='/api')
app.register_blueprint(operadores_bp, url_prefix='/api')
app.register_blueprint(operadores_dashboard_bp, url_prefix='/api')
app.register_blueprint(vendas_bp, url_prefix='/api')
app.register_blueprint(upload_bp, url_prefix='/api')
app.register_blueprint(upload_simples_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
