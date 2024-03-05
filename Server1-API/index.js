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

// postSensorData function
async function postSensorData(sensorData) {
    const baseURL = "https://jim3.xyz";
    const url = `${baseURL}/sensors`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };
    // Make a POST request to the live server using axios
    try {
        const response = await axios.post(url, sensorData, options);
        console.log("Data sent to server:", response.data);
    } catch (error) {
        console.error("Error sending data to server:", error);
    }
}

app.post("/sensors", (req, res) => {
    console.log("Received sensor data:", req.body); // Always log the received data
    const sensorData = req.body;
    console.log(sensorData);

    // Make a POST request to the live server using a seperate function
    postSensorData(sensorData);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// ========================================================
