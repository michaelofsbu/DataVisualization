from flask import Flask, render_template, jsonify
from modules.dataprocessing import read

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

@app.route("/get_stackchart_data/<argument>")
def get_linechart_data(argument):
    data = []
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)