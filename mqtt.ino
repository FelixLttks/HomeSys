void initializeMqtt(){
    String broker = ccu3;
    int broker_len = broker.length() + 1;
    char broker_array[broker_len];
    broker.toCharArray(broker_array, broker_len);

    client.setServer(broker_array, 1883);
    client.setCallback(callback);

    while (!client.connected())
    {
        String client_id = "esp32-client-" + String(WiFi.macAddress());
        Serial.printf("> The client %s connects to the public mqtt broker\n", client_id.c_str());
        if (client.connect(client_id.c_str(), "public", "public"))
        {
            Serial.println("i   Public mqtt broker connected");
        }
        else
        {
            Serial.print("i   failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
    client.subscribe(String(gridpowerCcu).c_str());
}


void callback(char *topic, byte *payload, unsigned int length)
{
    String payload_str;
    for (int i = 0; i < length; i++)
    {
        payload_str += (char)payload[i];
    }
    Serial.println("topic: " + String(topic) + " payload: " + payload_str);

    if(String(topic) == gridpowerCcu){
        gridPowerCcu = payload_str;
    }
}