from flask import Flask, render_template

app = Flask(__name__)

# Configuración
API_URL = 'https://backendapifutbol.up.railway.app'

@app.route('/')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/dashboard')
def dashboard_page():
    return render_template('dashboard.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)