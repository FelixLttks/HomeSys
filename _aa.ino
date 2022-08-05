//  this file makes shure everything gets imported/included before the actual program start
//  Arduino reads file in alphabetical order, so aaa.ino will most likely be the first

#include "WiFi.h"
#include <AsyncTCP.h>
#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32_FTPClient.h>
#include "time.h"


#include "config.h"


AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
// ESP32_FTPClient ftp(ftp_server, ftp_user, ftp_pass, 5000, 2);


unsigned long epochTime; 
String content = "";



// somehow this methode has to be in the first file
void onWebEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
                void *arg, uint8_t *data, size_t len)
{
    switch (type)
    {
    case WS_EVT_CONNECT:
        Serial.println(client->id());
        Serial.println(client->remoteIP().toString().c_str());
        ws.textAll(String("{\"type\": \"deviceconnected\", \"data\": {\"ip\": \"") + String(client->remoteIP().toString().c_str()) + "\", \"id\": \"" + client->id() + "\"}}");
        Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
        log("WebSocket client connected from "+ String(client->remoteIP().toString().c_str()));
        break;
    case WS_EVT_DISCONNECT:
        Serial.printf("WebSocket client #%u disconnected\n", client->id());
        break;
    case WS_EVT_DATA:
        // ws.textAll(data, len);
        handleWebSocketMessage(arg, data, len);

        break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
        break;
    }
}
