#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"
#include <PubSubClient.h>
#include <HTTPClient.h>

#include "config.h"

AsyncWebServer server(80);
WiFiClient espClient;
PubSubClient client(espClient);

String gridPowerCcu = "{\"ts\":0,\"v\":0,\"s\":0}";

void setup()
{
    Serial.begin(115200);
    delay(4000);

    // Initialize SPIFFS
    if (!SPIFFS.begin(true))
    {
        Serial.println("An Error has occurred while mounting SPIFFS");
        return;
    }

    // connecting to WIFI
    WiFi.setHostname(hostname); //  http://energy
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED){ 
        delay(1000);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the WiFi network: " + String(ssid) + " with ip: " + String(WiFi.localIP()));

    initializeServer();
    initializeMqtt();
}

void loop(){
    client.loop();
}