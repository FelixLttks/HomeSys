
AsyncWebServer server(80);

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

    while (WiFi.status() != WL_CONNECTED){ 
        delay(1000);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the WiFi network: " + String(ssid) + " with ip: " + String(WiFi.localIP()));

    initializeServer();
    qHomeToken = getNewQHomeToken();
}

void loop(){
}