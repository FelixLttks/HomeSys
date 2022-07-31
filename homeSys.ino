
AsyncWebServer server(80);

unsigned long previousMillisReconnect = 0;
unsigned long intervalReconnect = 5 * 60 * 1000;    // 5 min

String qHomeToken;

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

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the WiFi network: " + String(ssid) + " with ip: " + String(WiFi.localIP()));

    initializeServer();
    qHomeToken = getNewQHomeToken();
}

void loop()
{
    unsigned long currentMillisReconnect = millis();
    // if WiFi is down, try reconnecting every CHECK_WIFI_TIME seconds
    if ((WiFi.status() != WL_CONNECTED) && (currentMillisReconnect - previousMillisReconnect >= intervalReconnect))
    {
        Serial.print(millis());
        Serial.println("Reconnecting to WiFi...");
        WiFi.disconnect();
        WiFi.reconnect();
        previousMillisReconnect = currentMillisReconnect;
    }
}