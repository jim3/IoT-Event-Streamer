# IoT Event Streamer

---

## Overview

An _IoT Event Streamer_ for microcontroller sensor data. This project is a simple example of how to stream sensor data from a microcontroller, via `HTTP`, to an `HTTPS` webserver located on the internet. The data is then pushed to a client on the live server via SSE (server-sent events). Uses HTML & JavaScript to display the data.

The project is divided into parts: the C++ firmware for the microcontroller, two different Node.js servers and a simple HTML page with JavaScript. 

`Server #1` is ran locally, on your LAN. It's a Node/Express server and takes `POST` requests from the _microcontroller_, processes the sensor data and then makes a POST request to `Server #2` located on an HTTPS encrypted webserver. 

Server #2 listens at a `/sensors` endpoint where it recieves the sensor data. The server code also has a `GET` endpoint called `/events` that listens for the sensor data and pushes it to the client via `SSE` where it's displayed.

Because the project is in its infancy, I have purposely slowed down the data stream to make it easier to see the data \*(see demo). I plan to change it to real-time once the project has matured a bit. But honestly, that isn't the focus of the project. The focus is really the entire process here. That is, what do you do if you have an IoT device that doesn't support or have an `HTTPS` library? How to get your sensor data "out" of your local area network and *into* the internet using `HTTPS`. No way woudl you want to send your sensor data via HTTP, that's extremely insecure. And, you refused to pay for the cost of using a cloud provider? That's when I discovered how powerful the standard HTTP methods (GET, POST) and a API really are in this case. I am sure there is more than one way to do this but this proved to be the most rock solid and *secure* way of doing it after trying other a few other ways. And lastly, why didn't I just use the C++ code to make a direct call to the live server instead? It's more secure, in my opinion, which is very important with dealing with data, especially IoT devices. In my opinion, the local Express.js server code (and npm libraries) adds an extra layer of security by providing validation, additional data processing and error checking that the C++ library most definitely did not have. It was mainly a way to get the data out of the device but that's where it ended. 

In ways, this project is a culmination of all that I've learned over the last 1-2 years (client, server and microcontroller programming all in one). This project has almost everything I'd like to learn *more* about so I plan to improve it while I learn...there's still *lots* to learn, improve, add...

Check out an inital "test run" of the project at: [https://jim3.xyz](https://jim3.xyz) At the moment it prints out values every 5 seconds so wait till the table populates when visiting. A `BME680` environmental sensor would be more interesting so that is what I am working on now. :) Will be using a `ESP32` series microcontoller, first time working with an ESP32 so looking forward to it.

## Usage

### Hardware connections

This library uses the ADXL362 in SPI mode. The wonderful thing about it is that you do not have to know about SPI or SPI programming to use it. The library takes care of all of that for you. The only thing you need to do is to connect the ADXL362 to the Particle device as shown in the table below.

Note: Unless you are the type that _wants_ to do SPI programming [see datasheet below], be thankful for the library. :)
IoT 

<img src="images/01-adxl362.jpg" alt="adxl362" width="300"/><br>
<img src="images/02-adxl362.jpg" alt="adxl362" width="300"/>
<img src="images/03-adxl362.jpg" alt="adxl362" width="300"/>

|     Breakout     | Particle Device | Color  |      Description       |
| :--------------: | :-------------: | :----: | :--------------------: |
|       VIN        |       3V3       |  Red   |     3.3V DC Power      |
|       GND        |       GND       | Black  |         Ground         |
|    SCL / SCLK    |     SPI CLK     | Orange |    SPI Clock (SCK)     |
| SDA / MOSI / SDI |    SPI MOSI     |  Blue  |     SPI Master Out     |
|    SDO / MISO    |    SPI MISO     | Green  |     SPI Master In      |
|        CS        |       A2        | Yellow |    SPI Chip Select     |
|       INT2       |       n/c       |        | Interrupt 2 (not used) |
|       INT1       |       n/c       |        | Interrupt 1 (not used) |

### Tech Stack

-   C++ (firmware)
-   Node.js (server) / Express.js
-   HTML, JavaScript (client)
-   SSE (server-sent events)
-   ADXL362 (accelerometer)
-   Particle Photon 2 (microcontroller)

---
