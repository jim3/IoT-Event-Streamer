# IoT Event Streamer

---

## Overview

An _IoT Event Streamer_ for microcontroller sensor data. This project is a simple example of how to stream sensor data from a microcontroller to a central server located on your local area network. From therem hand it off to another server located on the internet. The data is then pushed to a client via SSE (server-sent events). The client uses HTML & JavaScript to display the data.

The project is divided into parts: the C++ firmware for the microcontroller, two different Node.js servers and a simple HTML page with JavaScript. `Server #1` is located on a local area network and takes `POST` requests from the _microcontroller_. Server #1 then makes a POST request to `Server #2` located on a domain. Server #2 listens at a `/sensors` endpoint where it recieves the sensor data. Server #2 also has a GET endpoint called `/events` that listens for the sensor data and pushes it to the client, `index.html`, via `SSE`. The client is a simple HTML page with JavaScript to display the sensor data in real-time. 

Because the project is in its infancy, I have purposely slowed down the data stream to make it easier to see the data \*(see demo). I plan to change it to real-time once the project has matured a bit. And honestly, that isn't the focus of the project, displaying data in real-time. The focus is really the entire process. I discovered how powerful the standard HTTP methods (GET, POST) and API's really are. And also, when your microcontroller doesn't support HTTPS, how to get your sensor data out of your local area network, using `HTTP` and into the internet using `HTTPS` without using a cloud provider.

In ways, this project is a culmination of all that I've learned over the last 1-2 years. And because this project has almost everything I'd like to learn more about I'll be on this for a while. I'm not sure how long it will take, but I'm in no hurry. I'm just enjoying the journey. :)

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

#### Note

You can check out (a very crude) initial "demo" at my domain \*[https://jim3.xyz](https://jim3.xyz). It's not up all the time, but when it is, you can see the sensor populating the screen. I will replace types of sensors as I go along. I'm just using the ADXL362 as a starting point. A BME680 is next, will be using a ESP32 for that. Really looking forward to that. :)
