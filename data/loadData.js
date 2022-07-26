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

function getQHomeData(token, inverter_sn, date) {
    const data = "inverterSn=" + INVERTER_SN + "&time=" + date;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", "https://qhome-ess-g3.q-cells.eu/phoebus/inverterIndex/getInverterState", false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.setRequestHeader("token", token);

    xhr.send(data);

    return JSON.parse(xhr.responseText);
}

function getNewQHomeToken() {
    const xhrData = "username=" + USR + "&userpwd=" + PWD;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", "https://qhome-ess-g3.q-cells.eu/phoebus/login/loginNew", false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

    xhr.send(xhrData);

    dataLogin = JSON.parse(xhr.responseText);
}

config = JSON.parse(httpGet("/api?type=config"))

qHome_usr = config.qHome_usr
qHome_pwd = config.qHome_pwd

console.log('qHome_usr: ' + qHome_usr)