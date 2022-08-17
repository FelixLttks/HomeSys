function httpGet(theUrl, handleResponse) {
    console.log('GET req: ' + theUrl)
    let xmlhttp;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (handleResponse != 'return' && handleResponse != null) {
        xmlhttp.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                handleResponse(this.responseText);
            }
        });
    }

    // xy() true
    // null true
    // 'return' false

    xmlhttp.open("GET", theUrl, handleResponse != 'return');
    xmlhttp.send();

    if (handleResponse == 'return') {
        return xmlhttp.response;
    }
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
        xhr.open("POST", "https://qhome-ess-g3.q-cells.eu/phoebus/inverterIndex/getInverterState");
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.setRequestHeader("token", token);

    xhr.send(data);
}

function setCurrent(data) {
    data = JSON.parse(data)
    if (document.readyState === 'complete') {
        updateCurrentUi(data)
        return
    }
    document.addEventListener("DOMContentLoaded", function(event) {
        updateCurrentUi(data)
    });
}

function updateCurrentUi(data) {
    console.log('gridpower: ' + data.gridpower)
    if (data.gridpower == undefined) {
        document.getElementById('overviewUpdate').style.display = 'flex'
        document.getElementById('updateLoading').style.display = 'none'
        document.getElementById('updateBtn').style.display = 'block'
    } else {
        document.getElementById('overviewUpdate').style.display = 'none'
    }

    document.getElementById('solarOverview').querySelector('.data').innerHTML = (data.powerdc1 + data.powerdc2) + 'W'
    document.getElementById('batteryOverview').querySelector('.data').innerHTML = data.batteryCapacity + '%'
    document.getElementById('gridOverview').querySelector('.data').innerHTML = Math.abs(data.feedinpower) + 'W'
    document.getElementById('houseOverview').querySelector('.data').innerHTML = (data.powerdc1 + data.powerdc2 - data.feedinpower - data.batPower1) + 'W'
    document.getElementById('inverterOverview').querySelector('.data').innerHTML = data.gridpower + 'W'

    updateDots(data)
        // updateRecomms(data)

    document.getElementById('lastUpdated').innerHTML = 'last updated: ' + new Date().toLocaleTimeString()
}

function setChart(data) {
    dataQHome = []
    data = JSON.parse(data)
    for (let i = 0; i < data.length; i++) {
        uploadTimeValue = data[i].uploadTimeValue
        dataQHome.push({
            ts: (parseInt(uploadTimeValue.slice(11, 13)) * 60 + parseInt(uploadTimeValue.slice(14, 16))) * 100 / (60 * 24),
            uploadTimeValue: uploadTimeValue,
            solar: data[i].pvPower,
            grid: data[i].gridpower,
            battery: data[i].batteryCapacity,
            feedinpower: -data[i].feedinpower,
            consumption: data[i].pvPower - data[i].feedinpower - data[i].bmsBatPower
        })
    }
    if (document.readyState === 'complete') {
        createDataset(dataQHome)
    }
    document.addEventListener("DOMContentLoaded", function(event) {
        createDataset(dataQHome)
    });
    // console.log(dataQHome)
    chartsToLoad -= 1;
    if (chartsToLoad <= 0) {
        document.getElementById('updateChart').style.display = 'none'
    }

}

function loadChart(date) {
    console.log('loadChart: ' + date)
    getQHomeData(qHomeToken, inverterSn, date, setChart)
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function test() {
    console.log('start timer');
    await delay(5000);
    console.log('after 1 second');

    if (qHomeToken != '') {
        document.addEventListener("DOMContentLoaded", function(event) {
            document.getElementById('statusQHome').style.backgroundColor = '#11AB73'
        });
    } else {
        console.log('empty qHomeToken')
    }


    getQHomeData(qHomeToken, inverterSn, '', setCurrent)
    getQHomeData(qHomeToken, inverterSn, new Date().toISOString().split('T')[0], setChart)

    initButton()
}

test()

config = JSON.parse(httpGet("/api?type=config", 'return'))
console.log(config)

qHomeToken = config.qHomeToken
inverterSn = config.inverter_sn
shellyIp = config.shelly_ip

console.log('qHomeToken: ' + qHomeToken)



dataQHome = []
chartsToLoad = 0;


window.setInterval(function() {
    getQHomeData(qHomeToken, inverterSn, '', setCurrent)
    getQHomeData(qHomeToken, inverterSn, date.toISOString().split('T')[0], setChart)
}, 1000 * 60);