# Your main script, the other files are imported here
# Adjust the url/header values to match your server 
# Also, adjust the pin values to match your hardware
from bme680 import *
from machine import I2C, Pin
import time
import urequests

# adjust the pin values however you
bme = BME680_I2C(I2C(-1, Pin(22), Pin(21)))

url = "http://192.168.0.205:3000/sensors"
headers = {'Content-Type': 'application/json'}

while True:
    # Temperature, Humidity, Pressure, Gas
    fahrenheit = (bme.temperature * 9/5) + 32
    celsius = bme.temperature
    humidity = bme.humidity
    pressure = bme.pressure
    gas = bme.gas

    # log the data to the console for debugging
    print('\n')
    print(f"-----------------------")

    for _ in range(3):
        print(f"Temperature: {celsius} C / {fahrenheit} F")
        print(f"Humidity: {humidity}")
        print(f"Pressure: {pressure} hPa")
        print(f"Gas: {gas} Ohms")
        print(f"-----------------------")

    # create a dictionary to send to the server
    data = {
        "temperature": celsius,
        "humidity": humidity,
        "pressure": pressure,
        "gas": gas
    }

    # send the data to the server
    response = urequests.post(url, json=data, headers=headers)
    print(response.json())
    response.close()

    time.sleep(5)  # pause for 5 seconds

# -------------------------------------------------------------
