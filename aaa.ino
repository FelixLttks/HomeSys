//  this file makes shure everything gets imported/included before the actual program start
//  Arduino reads file in alphabetical order, so aaa.ino will most likely be the first

#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"
#include <PubSubClient.h>
#include <HTTPClient.h>

#include "config.h"