from flask import Flask
from flask_wtf.csrf import CSRFProtect
from flask_talisman import Talisman
import os


SECRET_KEY = os.urandom(32)
csrf = CSRFProtect()
fahrli = Flask(__name__)
csp = { 'default-src': '\'self\'', 
		'script-src': ['\'self\'', '\'unsafe-inline\'', '*.canvasjs.com'], 
		'style-src': ['\'self\'', '\'unsafe-inline\'', '*.canvasjs.com'] }
Talisman(fahrli, content_security_policy=csp, content_security_policy_nonce_in=['script-src'])
fahrli.config['SECRET_KEY'] = SECRET_KEY
csrf.init_app(fahrli)

from fahrli import routes
