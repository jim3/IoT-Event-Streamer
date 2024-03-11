try:
  import usocket as socket
except:
  import socket
  
from time import sleep

from machine import Pin, I2C
import network

import esp
esp.osdebug(None)

import gc
gc.collect()

from bme680 import *

# ESP32 - Pin assignment
i2c = I2C(scl=Pin(22), sda=Pin(21))

# ESP8266 - Pin assignment
#i2c = I2C(scl=Pin(5), sda=Pin(4))

ssid = '<SSID>'
password = '<PASSWORD>'

station = network.WLAN(network.STA_IF)

station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
  pass

print('Connection successful')
print(station.ifconfig())
