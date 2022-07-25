void initializeServer()
{
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", String(), false, processor); });

    server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/style.css", "text/css"); });

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
