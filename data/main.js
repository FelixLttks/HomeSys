function openSubContent(name, btn) {
    document.querySelectorAll('.navBtn').forEach(function(button) {
        button.classList.remove("selected")
    });
    btn.classList.add("selected")
    document.querySelectorAll('.subcontent').forEach(function(subcontent) {
        subcontent.style.display = 'none'
            // console.log(subcontent)
    });
    document.getElementById(name).style.display = 'block'
}

function setHm(deviceId, state) {
    // httpGet('/api?type=sethm&deviceid=' + deviceId + '&state=' + state, handleHmResponse)
    httpGet('http://ccu3-whv/addons/xmlapi/statechange.cgi?ise_id=' + deviceId + '&new_value=' + state, null)

    document.getElementById('hmSuccess').style.visibility = 'visible'
    setTimeout(function() {
        document.getElementById('hmSuccess').style.visibility = 'hidden'
    }, 3000); //run this after 3 seconds
}

function handleHmResponse(data) {
    console.log('hm response: ' + data)
    document.getElementById('hmSuccess').style.visibility = 'visible'
    if (data = "true") {
        document.getElementById('hmSuccess').innerHTML = 'submitted successfully'
    } else {
        document.getElementById('hmSuccess').innerHTML = 'submitting failed'
    }

    setTimeout(function() {
        document.getElementById('hmSuccess').style.visibility = 'hidden'
    }, 3000); //run this after 3 seconds
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}