// Server #2 - Our live server is responsible for receiving sensor data
// from the BME680 sensor [local server] and sending it to the client
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
    res.setHeader("X-Accel-Buffering", "no"); // For NGINX unbuffered responses
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders(); // flush the headers to establish SSE with the client

    clients.push(res);
    req.on("close", () => {
        clients = clients.filter((client) => client !== res);
    });
});

// this is our /sensors endpoint where we recieve our sensor data
app.post("/sensors", (req, res) => {
    console.log("Server #2 has received bme680 sensor data:", req.body); // this logs the sensor data
    clients.forEach((client) => client.write(`data: ${JSON.stringify(req.body)}\n\n`));
    res.status(204).end();
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
