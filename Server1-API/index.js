// Server #1: Local server to receive data from sensors and send it to the live server

const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ----------------------------------------------------------

app.post("/sensors", async (req, res) => {
    const sensorData = req.body;
    if (!sensorData) {
        res.status(400).send("No data received");
    }
    try {
        console.log("API call from /sensors route...", sensorData);
        const baseURL = "https://jim3.xyz";
        const url = `${baseURL}/sensors`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await axios.post(url, sensorData, options); // ; ????
        console.log("Data sent to server:", response.data);
        res.status(200).json({ message: "Data received successfully" });
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request:", error.request);
        } else {
            // something else happened during the request...
            console.error("Error", error.message);
        }
        res.status(500).send("Error sending data to server");
    }
});

// ----------------------------------------------------------

app.post("/accelerometer", async (req, res) => {
    const sensorData = req.body;
    if (!sensorData) {
        res.status(400).send("No data received");
    }
    try {
        console.log("Making API call to server #2:", sensorData);
        const baseURL = "https://jim3.xyz";
        const url = `${baseURL}/accelerometer`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await axios.post(url, sensorData, options);
        console.log("Sending ADXL362 sensor data to server #2:", response.data);
        res.status(200).json({ message: "Data received successfully" });
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
            console.error("Error request:", error.request);
        } else {
            console.error("Error", error.message);
        }
        res.status(500).send("Error sending data to server");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
