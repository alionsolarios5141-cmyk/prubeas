from flask import Flask, render_template,url_for, request, redirect, flash
from flask_login import login_required, login_user, LoginManager, current_user, logout_user
from flask_mysqldb import MySQL
from config import config
from werkzeug.security import generate_password_hash
from models.entities.User import User

from models.entities.ModelUser import ModelUser




inzanidadApp = Flask(__name__)
db   = MySQL(inzanidadApp)
inzanidadApp.config.from_object(config['development'])

login_manager = LoginManager()
login_manager.init_app(inzanidadApp)

@login_manager.user_loader
def load_user(id):
    return ModelUser.get_by_id(db, id)


@inzanidadApp.route('/')
def home():
    return render_template('home.html')

@inzanidadApp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        nombre = request.form['nombre']
        correo = request.form['correo']
        clave = request.form['clave']
        claveCifrada = generate_password_hash(clave)
        redgUser = db.connection.cursor()
        redgUser.execute("INSERT INTO usuario (nombre, correo, clave) VALUES (%s, %s, %s)", (nombre, correo, claveCifrada))
        db.connection.commit()
        return render_template('home.html')
    else:
        return render_template('home.html')

@inzanidadApp.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        usuario = User(0,None, request.form['correo'], request.form['clave'], None)
        usuarioAutenticado = ModelUser.signin(db, usuario)
        if usuarioAutenticado is not None:
            if usuarioAutenticado.clave:
                login_user(usuarioAutenticado)
                if usuarioAutenticado.perfil == 'A':
                    return redirect(url_for('home_admin'))
                else:
                    return redirect(url_for('home_user'))
            else:
                flash("Contraseña incorrecta")
                return render_template('home.html')
        else:
            flash("Usuario inexistente")
            return render_template('home.html')
    else:
        return render_template('home.html')

@inzanidadApp.route('/signout', methods=['GET', 'POST'])
def signout():
    logout_user()
    return redirect(url_for('home'))

@inzanidadApp.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    return render_template('admin.html')

@inzanidadApp.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    return render_template('admin.html')

@inzanidadApp.route('/Suario', methods=['GET', 'POST'])
@login_required
def sUario():
    selUsuario = db.connection.cursor()
    Selusuario.execute("SELECT * FROM usuario")
    u = selUsuario.fetchall()
    selUsuario.close()
    return render_template('sUsuario.html')

if __name__ == '__main__':
    inzanidadApp.run(port=10000)