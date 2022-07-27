function httpGet(theUrl) {
    console.log('GET req: ' + theUrl)
    let xmlhttp;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            return xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();

    return xmlhttp.response;
}

function getQHomeData(token, inverter_sn, date, handleData) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            // console.log(this.responseText);
            handleData(this.responseText);
        }
    });

    data = ''
    if (date == '') {
        // console.log('current status')
        data = "inverterSN=" + inverter_sn;
        xhr.open("POST", "https://qhome-ess-g3.q-cells.eu/phoebus/device/getInverterFromRedis");
    } else {
        // console.log('history status')
        data = "inverterSn=" + inverter_sn + "&time=" + date;
        xhr.open("POST", "https://qhome-ess-g3.q-cells.eu/phoebus/inverterIndex/getInverterState", false);
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.setRequestHeader("token", token);

    xhr.send(data);
}

function setCurrent(data) {
    data = JSON.parse(data)
    document.getElementById('solarOverview').querySelector('.data').innerHTML = (data.powerdc1 + data.powerdc2) + 'W'
    document.getElementById('batteryOverview').querySelector('.data').innerHTML = data.batteryCapacity + '%'
    document.getElementById('gridOverview').querySelector('.data').innerHTML = data.feedinpower + 'W'
    document.getElementById('houseOverview').querySelector('.data').innerHTML = (data.powerdc1 + data.powerdc2 - data.feedinpower) + 'W'

    updateDots(data)
}

config = JSON.parse(httpGet("/api?type=config"))
console.log(config)

qHomeToken = config.qHomeToken
inverterSn = config.inverter_sn

console.log('qHomeToken: ' + qHomeToken)

getQHomeData(qHomeToken, inverterSn, '', setCurrent)