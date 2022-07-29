function openSubContent(name, btn) {
    document.querySelectorAll('.navBtn').forEach(function(button) {
        button.classList.remove("selected")
    });
    btn.classList.add("selected")
    document.querySelectorAll('.subcontent').forEach(function(subcontent) {
        subcontent.style.display = 'none'
        console.log(subcontent)
    });
    document.getElementById(name).style.display = 'block'
}

function setHm(deviceId, state) {
    httpGet('/api?type=sethm&deviceId=' + deviceId + '&state=' + state)
}