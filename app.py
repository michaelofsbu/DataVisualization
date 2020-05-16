from flask import Flask, render_template, jsonify
from modules.dataprocessing import read
import pandas as pd

app = Flask(__name__)

url = 'https://raw.githubusercontent.com/michaelofsbu/cse564_finaldata/master/Legally_Operating_Businesses.csv'
global processed_data
processed_data = read(url)

@app.route("/")
def index():
    
    return render_template("index.html")

@app.route("/get_map_data/<argument>")
def get_map_data(argument):
    data = []
    return jsonify(data)

@app.route("/get_MDS_data/<argument>")
def get_mds_data(argument):
    data = []
    return jsonify(data)

@app.route("/get_barchart_data/<argument>")
def get_barchart_data(argument):
    data = []
    return jsonify(data)

@app.route("/get_stackchart_data/<Licensetype>")
def get_stackchart_data(Licensetype):
    data = []
    daterange = pd.date_range(start='2010-01', end='2020-05', freq='M')
    industry = processed_data.loc[processed_data['License Type'] == Licensetype, 'Industry'].unique()
    for date in daterange:
        temp = {}
        temp['Date'] = str(date.year) + '-' + str(date.month) + '-' + str(date.day)
        for type in industry:
            temp[type] = len(processed_data.loc[(processed_data['Industry'] == type) & (processed_data['License Expiration Date'] > date) & (processed_data['License Creation Date'] < date)].index)
        data.append(temp)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)