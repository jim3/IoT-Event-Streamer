// ----------------------------------------------------------------------------
// BME680 Sensor Reader [I2C]
// [Adafruit_BME680 Library](https://docs.particle.io/reference/device-os/libraries/a/Adafruit_BME680/)
// [HttpClient Library](https://docs.particle.io/reference/device-os/libraries/h/HttpClient/)
// ----------------------------------------------------------------------------

#include "Particle.h"
// ----------------------------
#include "Adafruit_BME680.h"
#include "HttpClient.h"

#define BME_SCK 13
#define BME_MISO 12
#define BME_MOSI 11
#define BME_CS 10

#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME680 bme;  // I2C
// Adafruit_BME680 bme(BME_CS); // hardware SPI
// Adafruit_BME680 bme(BME_CS, BME_MOSI, BME_MISO,  BME_SCK);

double temperatureInC = 0;
double relativeHumidity = 0;
double pressureHpa = 0;
double gasResistanceKOhms = 0;
double approxAltitudeInM = 0;

HttpClient http;

http_header_t headers[] = {
    {"Content-Type", "application/json"},
    {NULL, NULL}  // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;

// ----------------------------------------------------------------------------

void setup() {
    if (!bme.begin()) {
        Particle.publish("Log", "Could not find a valid BME680 sensor, check wiring!");
    } else {
        Particle.publish("Log", "bme.begin() success =)");
        // Set up oversampling and filter initialization
        bme.setTemperatureOversampling(BME680_OS_8X);
        bme.setHumidityOversampling(BME680_OS_2X);
        bme.setPressureOversampling(BME680_OS_4X);
        bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
        bme.setGasHeater(320, 150);  // 320*C for 150 ms

        Particle.variable("temperature", &temperatureInC, DOUBLE);
        Particle.variable("humidity", &relativeHumidity, DOUBLE);
        Particle.variable("pressure", &pressureHpa, DOUBLE);
        Particle.variable("gas", &gasResistanceKOhms, DOUBLE);
        Particle.variable("altitude", &approxAltitudeInM, DOUBLE);

        // Set up the HTTP request
        request.hostname = "192.168.0.205";  // Your server's IP
        request.port = 3000;                 // Your server's port
        request.path = "/sensors";
    }
}

// ----------------------------------------------------------------------------

void loop() {
    if (!bme.performReading()) {
        Particle.publish("Log", "Failed to perform reading :(");
    } else {
        temperatureInC = bme.temperature;
        relativeHumidity = bme.humidity;
        pressureHpa = bme.pressure / 100.0;
        gasResistanceKOhms = bme.gas_resistance / 1000.0;
        approxAltitudeInM = bme.readAltitude(SEALEVELPRESSURE_HPA);

        // add the data to a JSON string
        String data = String::format(
            "{"
            "\"temperatureInC\":%.2f,"
            "\"temperatureInF\":%.2f,"
            "\"humidityPercentage\":%.2f,"
            "\"pressureHpa\":%.2f,"
            "\"gasResistanceKOhms\":%.2f,"
            "\"approxAltitudeInM\":%.2f"
            "}",
            temperatureInC,
            temperatureInC * 9 / 5 + 32,
            relativeHumidity,
            pressureHpa,
            gasResistanceKOhms,
            approxAltitudeInM);

        request.body = data;

        // log the sensor data for debugging
        Serial.println("sensor data ->" + data);

        // make a post request
        http.post(request, response, headers);
        int statusCode = response.status;
        Serial.println(statusCode);

        String responseBody = response.body;
        Serial.println(responseBody);

        // Check for successful response (e.g., status code 200)
        if (statusCode == 200) {
            Serial.println("Success, data sent to server 1 " + responseBody);
        } else {
            Serial.println("Error, data not sent to server 2 " + responseBody);
        }

        delay(250);  // wait 250ms before taking another reading
    }
}
// ----------------------------------------------------------------------------
