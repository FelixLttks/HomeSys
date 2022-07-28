datasets = [{
    label: "PV",
    color: "#FBB13F",
    active: false,
    data: jsonToFunction(dataQHome, 'ts', 'solar')
}, {
    label: "feedinpower",
    color: "#fb3ff2",
    active: false,
    data: jsonToFunction(dataQHome, 'ts', 'feedinpower')
}, {
    label: "battery",
    color: "#3ccf2c",
    active: true,
    data: jsonToFunction(dataQHome, 'ts', 'battery')
}, {
    label: "consumption",
    color: "#553ffb",
    active: true,
    data: jsonToFunction(dataQHome, 'ts', 'consumption')
}]

function getMax(arr, prop, active) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if ((max == null || parseInt(arr[i][prop]) > parseInt(max[prop])) && (!active || arr[i]['active']))
            max = arr[i];
    }
    return max;
}

function convertY(y, maxY) {
    return 95 - y / maxY * 90
}

function convertX(percent) {
    return 20 + percent * 180 / 100
}

function loadGraph() {
    document.getElementById('lines').innerHTML = ''
    for (let i = 0; i < datasets.length; i++) {
        let obj = datasets[i];
        obj.max = getMax(obj.data, 'y').y
        obj.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
        });
        // console.log(obj);
    }
    overAllMax = getMax(datasets, 'max', true).max
    console.log('overAllMax ' + overAllMax)
    document.getElementById('maxY').innerHTML = overAllMax
    document.getElementById('halfY').innerHTML = Math.round(overAllMax / 2)
    document.getElementById('halfY').setAttribute('y', convertY(Math.round(overAllMax / 2), overAllMax) + 2)
    document.getElementById('halfYdash').setAttribute('d', 'M20 ' + convertY(Math.round(overAllMax / 2), overAllMax) + ' l215 0')
    for (let i = 0; i < datasets.length; i++) {
        let obj = datasets[i];
        if (obj.active) {
            points = '20,' + convertY(obj.data[0].y, overAllMax)
            for (let k = 0; k < obj.data.length; k++) {
                points += ' ' + convertX(obj.data[k].x) + ',' + convertY(obj.data[k].y, overAllMax)
            }
            // console.log('points: ' + points)
            document.getElementById('lines').innerHTML += '<polyline id="path" stroke-width="0.5" points="' + points + '" fill="none" stroke="' + obj.color + '" />'
        }
    }
}

function jsonToFunction(json, xProp, yProp) {
    func = []
    for (let i = 0; i < json.length; i++) {
        func.push({
            x: json[i][xProp],
            y: json[i][yProp]
        })
    }
    // console.log('func: ' + func)
    return func
}

function toggleChart(id, checkbox) {
    datasets[id].active = checkbox.checked
    console.log('id: ' + id + ' active: ' + datasets[id].active)
    loadGraph()
}

loadGraph()