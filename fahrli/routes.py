from fahrli import fahrli
from flask import render_template, jsonify
from flask_wtf.csrf import CSRFError
from fahrli.controllers import DataController
from fahrli.models import FAHEntry
import urllib.request
import json
import datetime

@fahrli.route('/')
@fahrli.route('/index')
def main():
	time_now = datetime.datetime.now()
	curdata = []
	with urllib.request.urlopen("https://stats.foldingathome.org/api/team/262021") as url:
		for donor in json.loads(url.read().decode())['donors']:
			curdata.append(FAHEntry.FAHEntry(-1, time_now, donor['id'], donor['team'], donor['name'], donor['credit'], donor['wus']))

	# Pull the most recent run by DateTime, check if the current run doesn't exactly match
	mostRecentRun = DataController.GetMostRecentFAHRun()

	somethingchanged = False

	for centry in curdata:
		check = next((f for f in mostRecentRun 
			if (f.UserId == centry.UserId and f.Credit == centry.Credit and f.WorkUnits == centry.WorkUnits )), None)
		if check is None:
			somethingchanged = True
			break

	if somethingchanged:
		for curentry in curdata:
			DataController.WriteFAHEntry(curentry)

	data = DataController.ReadFAHEntries()
	jsondata = []
	for d in data:
		jsondata.append(d.toJSON())
	
	return render_template('index.html', title='Folding @ WFH Stats', data=data)

@fahrli.route('/get_data')
def get_data():	
	data = DataController.ReadFAHEntries()
	jsondata = []
	for d in data:
		jsondata.append(d.toJSON())
	return jsonify(jsondata)

@fahrli.errorhandler(CSRFError)
def handle_csrf_error(e):
	return render_template('csrf_error.html', reason=e.description)
