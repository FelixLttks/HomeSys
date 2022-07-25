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
        if (type == "qhome")
        {
            if (!(request->hasParam("date")))
            {
                request->send(200, "text/plain", "{\"error\":\"no date specified\", \"data\": {}");
                return;
            }
            String date = request->getParam("date")->value();
            request->send(200, "text/plain", postRequest("https://qhome-ess-g3.q-cells.eu/phoebus/inverterIndex/getInverterState", "inverterSn=" + String(inverter_sn) + "&time=" + date, qHomeToken));
        } 
        request->send(200, "text/plain", "{\"error\":\"no valid type\", \"data\": {}"); });

    server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/style.css", "text/css"); });

    server.on("/loadData.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/loadData.js", "text/javascript"); });

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

    HTTPClient http;
    http.begin(url);
    http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS);

    // Specify content-type header
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    if (token != "")
    {
        http.addHeader("token", token);
    }

    // Data to send with HTTP POST
    String httpRequestData = data;

    // Send HTTP POST request
    int httpResponseCode = http.POST(httpRequestData);

    if (httpResponseCode > 0)
    {
        String response = http.getString();                                // Get the response to the request
        Serial.println("post req: " + url + " code: " + httpResponseCode); // Print return code
        Serial.println(response);         // Print request answer
        return response;
    }
    else
    {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
    }
    return "";
}

String getNewQHomeToken()
{
    String login = postRequest("https://qhome-ess-g3.q-cells.eu/phoebus/login/loginNew", "username=" + String(qHome_usr) + "&userpwd=" + String(qHome_pwd), "");
    return login.substring(login.indexOf("token") + 8, login.indexOf("token") + 44);
}
