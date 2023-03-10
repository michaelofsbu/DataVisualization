import json
import pickle
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

@app.route("/get_map_data/<cat>")
def get_map_data(cat):
    print(cat)
    data = json.dumps(bfuncs.get_map_info(processed_data, cat).to_dict(orient='records'))
    return jsonify(data)

@app.route("/get_barchart_data")
def get_barchart():
    data = json.dumps(bfuncs.count_frequency(processed_data).to_dict(orient='records'))
    return jsonify(data)

@app.route("/get_stackchart_data/<Licensetype>")
def get_stackchart_data(Licensetype):
    with open(Licensetype + ".txt", "rb") as fp:
        data = pickle.load(fp)
    return jsonify(data)

@app.route('/get_graph_data')
def get_graph_data():
    with open('cor_data.txt') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
