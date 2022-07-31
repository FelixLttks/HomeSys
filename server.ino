void initializeServer()
{
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", String(), false, processor); });

    server.on("/api", HTTP_GET, [](AsyncWebServerRequest *request)
              {
        if (!(request->hasParam("type")))
        {
            request->send(200, "text/plain", "{\"error\":\"no type specified\", \"data\": {}");
            return;
        }

        String type = request->getParam("type")->value();
        if (type == "config")
        {
            String config[4][2] = {{"ccu3", "ccu3-whv"}, {"qHomeToken", qHomeToken}, {"inverter_sn", inverter_sn}};
            request->send(200, "text/plain", createJsonFrom2dArray(config, 3));
        } else if(type == "valuereached"){
            if (!(request->hasParam("name")))
            {
                request->send(200, "text/plain", "{\"error\":\"no name specified\", \"data\": {}");
                return;
            }
            if (!(request->hasParam("value")))
            {
                request->send(200, "text/plain", "{\"error\":\"no value specified\", \"data\": {}");
                return;
            }
            String name = request->getParam("name")->value();
            String value = request->getParam("value")->value();
            Serial.println("valuereached: " + name + ": " + value);

            if(name == "feedin" && value == "400"){
                setShellyState(true);
            }
        } else if(type == "startautomation"){
            if (!(request->hasParam("device")))
            {
                request->send(200, "text/plain", "{\"error\":\"no device specified\", \"data\": {}");
                return;
            }
            String device = request->getParam("device")->value();
            if(device == "washingmachine"){
                startAutomation();
            }
        }
        request->send(200, "text/plain", "{\"error\":\"no valid type\", \"data\": {}"); });

    server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/style.css", "text/css"); });

    server.on("/loadData.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/loadData.js", "text/javascript"); });

    server.on("/chart.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/chart.js", "text/javascript"); });

    server.on("/overviewDots.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/overviewDots.js", "text/javascript"); });

    server.on("/favicon.ico", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/favicon.png", "image/png"); });

    server.on("/recommendation.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/recommendation.js", "text/javascript"); });

    server.on("/main.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/main.js", "text/javascript"); });

    server.on("/xml2json.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/xml2json.js", "text/javascript"); });

    server.on("/homematic.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/homematic.js", "text/javascript"); });

    server.on("/shelly", HTTP_GET, [](AsyncWebServerRequest *request)
              { 
                Serial.println("shelly submittesd");
                request->send(200, "text/plain", "hi shelly"); });

    server.on("/shellytest", HTTP_GET, [](AsyncWebServerRequest *request)
              { 
                Serial.println("shelly test");
                startAutomation();
                request->send(200, "text/plain", "startAutomation()"); });

    server.begin();
}

String processor(const String &var)
{
    Serial.println(var);
    if (var == "GPIO_STATE")
    {
        return "hi";
    }
    return String();
}

String postRequest(String url, String data, String token, String contentType)
{
    Serial.println("post req: " + url + " data: " + data + " token: " + token);

    // WiFiClient client;
    HTTPClient http;
    // http.begin(client, url);
    http.begin(url);
    http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS);

    // Specify content-type header
    http.addHeader("Content-Type", contentType);
    if (token != "")
    {
        Serial.println("added token: " + token);
        http.addHeader("token", token);
    }

    // Data to send with HTTP POST
    String httpRequestData = data;

    // Send HTTP POST request
    int httpResponseCode = http.POST(httpRequestData);

    if (httpResponseCode > 0)
    {
        // Serial.println(http);
        String response = http.getString();
        Serial.print("length: ");
        Serial.println(response.length());                                 // Get the response to the request
        Serial.println("post req: " + url + " code: " + httpResponseCode); // Print return code
        // Serial.println(response);                                          // Print request answer
        return response;
    }
    else
    {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
    }
    http.end();
    return "";
}

String getRequest(String url)
{
    // postRequest("http://" + String(shelly_ip) + "/relay/0?turn=" + (state ? "on" : "off"), NULL , "" ,"application/x-www-form-urlencoded");
    HTTPClient http;
    String serverPath = url;

    // Your Domain name with URL path or IP address with path
    http.begin(serverPath.c_str());

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
        return payload;
    }
    else
    {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
    return "";
}

String getNewQHomeToken()
{
    String login = postRequest("https://qhome-ess-g3.q-cells.eu/phoebus/login/loginNew", "username=" + String(qHome_usr) + "&userpwd=" + String(qHome_pwd), "", "application/x-www-form-urlencoded");
    return login.substring(login.indexOf("token") + 8, login.indexOf("token") + 44);
}

String createJsonFrom2dArray(String array[][2], int size)
{
    String json = "{";
    for (int i = 0; i < size; i++)
    {
        json += "\"" + array[i][0] + "\": \"" + array[i][1] + "\",";
    }
    // json = json.substring(0, json.length()-2) = "}";
    int length = json.length();
    json[length - 1] = '}';
    return json;
}