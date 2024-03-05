// ----------------------------------------------
// Analog Devices ADXL362 accelerometer [SPI]
// ----------------------------------------------

#include "Particle.h"
// -----------------
#include "ADXL362DMA.h"
#include "HttpClient.h"

SYSTEM_THREAD(ENABLED);
SerialLogHandler logHandler;

ADXL362DMA accel(SPI, A2);

unsigned long lastReport = 0;
const unsigned long lastReportPeriod = 100;
unsigned long temperatureReport = 0;
const unsigned long temperatureReportPeriod = 30000;

HttpClient http;
http_header_t headers[] = {
    {"Content-Type", "application/json"},
    {NULL, NULL}  // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;

// ----------------------------------------------------------------------------

void setup() {
    waitFor(Serial.isConnected, 10000);
    accel.softReset();
    while (accel.readStatus() == 0) {
        Log.info("no status yet, waiting for accelerometer");
        delay(1000);
    }
    accel.setMeasureMode(true);
    request.hostname = "192.168.0.205";  // Your server's IP
    request.port = 3000;                 // Your server's port
    request.path = "/sensors";
}

void loop() {
    if (millis() - lastReport >= lastReportPeriod) {
        lastReport = millis();
        int16_t x, y, z;
        accel.readXYZ(x, y, z);
        Serial.printlnf("%5d %5d %5d", (int)x, (int)y, (int)z);

        // Prepare the JSON data to send
        String sensorData = String::format("{\"x\": %d, \"y\": %d, \"z\": %d}", (int)x, (int)y, (int)z);
        Log.info("sending data %s", sensorData.c_str());
        request.body = sensorData;

        // POST request
        http.post(request, response, headers);
        int httpResponseCode = response.status;

        Serial.print("Application>\tResponse status: ");
        Serial.println(httpResponseCode);

        // Check for successful response (e.g., status code 200)
        if (httpResponseCode == 200) {
            Serial.println("Application>\tData sent successfully");
        } else {
            Serial.print("Application>\tError sending data: ");
            Serial.println(httpResponseCode);
        }

        // Delay between requests
        delay(5000);
    }

    if (millis() - temperatureReport >= temperatureReportPeriod) {
        temperatureReport = millis();
        Log.info("temperature %.1f C, %.1f F", accel.readTemperatureC(), accel.readTemperatureF());
        // TODO
    }
}
