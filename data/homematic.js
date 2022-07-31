function createRoom(id, name) {
    document.getElementById('roomList').innerHTML += `<div class="switchContainer" id="hmGardenwater">
    <p>` + name + `</p>
    <label class="btn">
        <input type="checkbox" onclick="openRoomMenu(` + id + `)">
        <span class="button" color="#FBB13F">
            <svg width="60" height="34" viewBox="0 0 60 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25.5 6L33.6716 14.1716C35.2337 15.7337 35.2337 18.2663 33.6716 19.8284L25.5 28" stroke="#6266EB" stroke-width="5"/>
                </svg>
        </span>
    </label>
</div>`
}

function closeRoomMenu() {
    document.getElementById('roomOver').style.display = 'none'
}

function openRoomMenu(id) {
    document.getElementById('deviceList').innerHTML = ""
    var roomOver = document.getElementById('roomOver')
    var room = rooms[id]
    roomOver.style.display = 'block'
    roomOver.querySelector('.subtitle').innerHTML = room['@attributes'].name
    console.log(room.channel)
    if (room.channel == undefined) {
        console.log('no devices')
        return
    }
    if (isArray(room.channel)) {
        for (let i = 0; i < room.channel.length; i++) {
            console.log(room.channel[i]['@attributes'].ise_id)
            createDevice(room.channel[i]['@attributes'].ise_id)
        }
    } else {
        console.log(room.channel['@attributes'].ise_id)
    }
}

function createDevice(ise_id) {
    data = httpGet('http://ccu3-whv/addons/xmlapi/state.cgi?channel_id=' + ise_id, 'return')
    dataObj = xml2jsonObj.fromStr(data)
        // console.log(dataObj)
    deviceName = dataObj.state.device['@attributes'].name
    deviceType = ''
    deviceState = ''
        // console.log(deviceName)
    for (let i = 0; i < dataObj.state.device.channel.length; i++) {

        if (dataObj.state.device.channel[i]['@attributes'].ise_id == ise_id) {
            datapoint = dataObj.state.device.channel[i].datapoint
                // console.log(datapoint)
            if (datapoint != undefined) {
                if (isArray(datapoint)) {
                    // console.log(datapoint[0]['@attributes'])
                    deviceType = datapoint[0]['@attributes'].type
                    deviceState = datapoint[0]['@attributes'].value
                } else {
                    deviceType = datapoint['@attributes'].type
                    deviceState = datapoint['@attributes'].value
                }
            }
        }
    }
    if (deviceType != '' && deviceState != '') {
        console.log(deviceName + ': ' + deviceType + ': ' + deviceState)
        if (deviceType == 'STATE') {
            document.getElementById('deviceList').innerHTML += `<div class="switchContainer" id="hmTest">
        <p>` + deviceName + `</p>
        <label class="switch">
            <input type="checkbox" onclick="setHm(` + ise_id + `, this.checked)" ` + (deviceState == 'true' ? "checked" : "") + `>
            <span class="slider round" color="#FBB13F"></span>
        </label>
    </div>`
        } else if (deviceType == 'LEVEL') {
            document.getElementById('deviceList').innerHTML += `<div class="switchContainer" id="hmRollo">
            <p>` + deviceName + `</p>
            <div class="shutters">
                <div class="shutterArrow" onclick="setHm(` + ise_id + `, 100)">
                    <svg width="60" height="34" viewBox="0 0 60 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 22.5L28.1716 14.3284C29.7337 12.7663 32.2663 12.7663 33.8284 14.3284L42 22.5" stroke="#6266EB" stroke-width="5"/>
                        </svg>

                </div>
                <div class="shutterArrow" onclick="setHm(` + ise_id + `, 0)">
                    <svg width="60" height="34" viewBox="0 0 60 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42 11.5L33.8284 19.6716C32.2663 21.2337 29.7337 21.2337 28.1716 19.6716L20 11.5" stroke="#6266EB" stroke-width="5"/>
                        </svg>

                </div>
            </div>

        </div>`
        }
    }

}

rooms = []

console.log(xml2jsonObj)

deviceList = httpGet("http://ccu3-whv/addons/xmlapi/roomlist.cgi", 'return')
console.log(deviceList)

deviceListObj = xml2jsonObj.fromStr(deviceList);
console.log(deviceListObj)

rooms = deviceListObj.roomList.room

for (let room = 0; room < rooms.length; room++) {
    roomObj = rooms[room]
    createRoom(room, roomObj['@attributes'].name)
}