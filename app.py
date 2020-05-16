import json
from flask import Flask, render_template, request, redirect, Response, jsonify
from modules.dataprocessing import read
import pandas as pd
import modules.barChartandMapfunctions as bfuncs

app = Flask(__name__)

url = 'processed_data.csv'
global processed_data
processed_data = pd.read_csv(url)

@app.route("/")
def index():

    return render_template("index.html")

@app.route("/get_map_data", methods = ["POST", "GET"])
def get_map_data():
    print(request.form["argument"])
    data = json.dumps(bfuncs.get_map_info(processed_data, request.form["argument"]).to_dict(orient='records'))
    return jsonify(data)

@app.route("/get_barchart_data", methods = ["POST", "GET"])
def get_barchart():
    data = json.dumps(bfuncs.count_frequency(processed_data).to_dict(orient='records'))
    return jsonify(data)

@app.route("/get_stackchart_data/<Licensetype>")
def get_stackchart_data(Licensetype):
    data = []
    daterange = pd.date_range(start='2010-01', end='2020-05', freq='M')
    processed_data['License_Expiration_Date'] = pd.to_datetime(processed_data['License_Expiration_Date'], format='%m/%d/%Y', errors='coerce')
    processed_data['License_Creation_Date'] = pd.to_datetime(processed_data['License_Creation_Date'], format='%m/%d/%Y', errors='coerce')
    industry = processed_data.loc[processed_data['License_Type'] == Licensetype, 'Industry'].unique()
    for date in daterange:
        temp = {}
        temp['Date'] = str(date.year) + '-' + str(date.month) + '-' + str(date.day)
        for type in industry:
            temp[type] = len(processed_data.loc[(processed_data['Industry'] == type) & (processed_data['License_Expiration_Date'] > date) & (processed_data['License_Creation_Date'] < date)].index)
        data.append(temp)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
