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
    console.log(name)
    console.log(rooms)
    if (name == 'homematic' && rooms.length == 0) {
        loadHmRooms()
        loadHmDevice()
    }
    console.log(screen.width)
    if (screen.width < 480) {
        document.getElementById('sideMenu').style.display = 'none'
    }
}


function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function toggleSideMenu() {
    menu = document.getElementById('sideMenu')
    if (menu.style.display == 'none') {
        menu.style.display = 'block'
    } else {
        menu.style.display = 'none'
    }
}

function loadMode(id) {
    response = httpGet('http://192.168.178.75/api?type=automationstate', 'return')
    document.getElementById('washMode').querySelector('input').checked = response == 'TRUE'
}

function callFunction(name) {
    websocket.send(JSON.stringify({
        type: 'callfunction',
        data: {
            name: name
        }
    }));
}

function updateToken(service) {
    document.getElementById('updateLoading').style.display = 'inline-block'
    document.getElementById('updateBtn').style.display = 'none'
    websocket.send(JSON.stringify({
        type: 'updatetoken',
        data: {
            service: service
        }
    }));
}