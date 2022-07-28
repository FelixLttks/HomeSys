void initializeServer()
{
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", String(), false, processor); });

    server.on("/get", HTTP_GET, [](AsyncWebServerRequest *request)
              {
        String PARAM_MESSAGE = "message";
        String message;
        if (request->hasParam(PARAM_MESSAGE)) {
            message = request->getParam(PARAM_MESSAGE)->value();
        } else {
            message = "No message sent";
        }
        request->send(200, "text/plain", "Hello, GET: " + message); });

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
            String config[4][2] = {{"ccu3", "ccu3-whv"}, {"qHomeToken", qHomeToken}, {"inverter_sn", "H34B12H6157017"}};
            request->send(200, "text/plain", createJsonFrom2dArray(config, 3));
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

String postRequest(String url, String data, String token)
{
    Serial.println("post req: " + url + " data: " + data + " token: " + token);

    // WiFiClient client;
    HTTPClient http;
    // http.begin(client, url);
    http.begin(url);
    http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS);

    // Specify content-type header
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
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
        Serial.println(response);                                          // Print request answer
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

String getNewQHomeToken()
{
    String login = postRequest("https://qhome-ess-g3.q-cells.eu/phoebus/login/loginNew", "username=" + String(qHome_usr) + "&userpwd=" + String(qHome_pwd), "");
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