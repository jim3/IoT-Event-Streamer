const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let clients = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Endpoint for the client to listen to
app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream"); // set the content type to event-stream
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // NGINX: unbuffered responses
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders(); // flush the headers to establish SSE with client

    clients.push(res);

    req.on("close", () => {
        clients = clients.filter((client) => client !== res);
    });
});

// this is our /sensors endpoint where we recieve our sensor data
app.post("/sensors", (req, res) => {
    req.body.sensorType = "bme680";
    console.log("Server #2 has received bme680 sensor data:", req.body); // this logs the sensor data

    clients.forEach((client) => client.write(`data: ${JSON.stringify(req.body)}\n\n`));
    res.status(204).end();
});

// /accelerometer endpoint for the ADXL362 sensor accelerometer
app.post("/accelerometer", (req, res) => {
    req.body.sensorType = "adxl362";
    console.log("Server #2 has received accelerometer data:", req.body);

    clients.forEach((client) => client.write(`data: ${JSON.stringify(req.body)}\n\n`));
    res.status(204).end();
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
