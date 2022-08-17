

unsigned long previousMillisReconnect = 0;
unsigned long intervalReconnect = 5 * 60 * 1000;    // 5 min

String qHomeToken;
bool ledState = 0;

String configJson;


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
    // WiFi.setHostname(hostname); //  http://energy
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the WiFi network: " + String(ssid) + " with ip: " + WiFi.localIP());

    initWebSocket();
    
    // qHomeToken = getNewQHomeToken();
    qHomeToken = "1570e9ca-5865-4652-9a72-e17608098295";

    String config[4][2] = {{"ccu3", "ccu3-whv"}, {"qHomeToken", qHomeToken}, {"inverter_sn", inverter_sn}, {"shelly_ip", shelly_ip}};
    configJson = createJsonFrom2dArray(config, 4);

    // ftp.OpenConnection();

    configTime(0, 0, ntpServer);

    epochTime = getTime() + 2 * 60 * 60;
    Serial.print("Epoch Time: ");
    Serial.println(epochTime);
    Serial.println(millis());

    initializeServer();

    log("setup done");
}

void loop()
{
    delay(2000);
    vTaskDelay(portMAX_DELAY);
    ws.cleanupClients();
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


unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}
