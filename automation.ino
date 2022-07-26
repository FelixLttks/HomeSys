bool shellyModeAuto = false;

void setShellyState(bool state)
{
    getRequest("http://" + String(shelly_ip) + "/relay/0?turn=" + (state ? "on" : "off"));
    shellyModeAuto = !state;
}

void startAutomation()
{
    Serial.println("starting automation");
    String deviceState = getRequest("http://" + String(ccu3) + "/addons/xmlapi/state.cgi?channel_id=" + String(energy_counter_channel_iseId));
    double energy_counter = deviceState.substring(deviceState.indexOf(String(energy_counter_iseId)) + 14,deviceState.indexOf(String(energy_counter_iseId)) + 21).toDouble();
    if(energy_counter < -400){
        setShellyState(true);
        ws.textAll(String("{\"type\": \"automationstate\", \"data\": {\"id\": \"washingmachine\", \"state\": \"false\"}}"));
    }else{
        setShellyState(false);
        ws.textAll(String("{\"type\": \"automationstate\", \"data\": {\"id\": \"washingmachine\", \"state\": \"true\"}}"));
    }
}
