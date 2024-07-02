#imports
from bson import json_util
from flask import Flask, render_template , request,json
import pymongo
# import json
import pandas as pd
import tensorflow as tf
# from sklearn.preprocessing import StandardScaler
# from sklearn.model_selection import train_test_split

#create flask
app = Flask(__name__)
#connect to mongo db to update dropdown options
serverUrl = "mongodb://localhost:27017"
client = pymongo.MongoClient(serverUrl)
db = client.MCI
# flight_data = pd.DataFrame(list(db.flight_data.find()))
years_data = pd.DataFrame(list(db.stats_by_year.find()))
months_data = pd.DataFrame(list(db.stats_by_month.find()))
dows_data = pd.DataFrame(list(db.stats_by_dow.find()))
origins_data = pd.DataFrame(list(db.stats_by_origin.find()))
dests_data = pd.DataFrame(list(db.stats_by_dest.find()))
carriers_data = pd.DataFrame(list(db.stats_by_carrier.find()))
X = list(db.X_dummies.find())

#home route
@app.route("/")
def default():
    return render_template('index.html')
#get data from mongo db route
@app.route("/get_data")
def get_data():
    return json_util.dumps(X[0])
@app.route("/get_Month_data")
def get_months_data():
    return json_util.dumps(months_data)
@app.route("/get_Year_data")
def get_years_data():
    return json_util.dumps(years_data)
@app.route("/get_Day of the Week_data")
def get_dows_data():
    return json_util.dumps(dows_data)
@app.route("/get_Airline_data")
def get_carriers_data():
    return json_util.dumps(carriers_data)

model = tf.keras.models.load_model('Resources/nn_model.keras')
# predict route that will post to the home route
@app.route('/predict', methods=['POST'])
def predict():
    #grab data used in payload in model.js
    if request.method == 'POST':
        data = request.form['data']
        #convert the data to json
        data = json.loads(data)
        #predict both models
        prediction = model.predict([data['data']])
        print(prediction)
        #reset the status
        status = ''
        #update status
        if (prediction>=.5):
            status = 'Delayed'
        else :
            status = 'On Time' 
        return f'Predicted Status: {status}, Prediction: {"{:.2f}".format(prediction[0][0])}'

if __name__ == '__main__':
    app.run(debug=True, port=5500)
