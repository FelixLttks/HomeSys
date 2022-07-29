datasets = []

// createDataset(dataQHome)

function createDataset(data) {
    // console.log(data)
    datasets = [{
        label: "PV",
        color: "#FBB13F",
        active: document.getElementById('solarSwitch').querySelector('input').checked,
        data: jsonToFunction(data, 'ts', 'solar')
    }, {
        label: "feedinpower",
        color: "#fb3ff2",
        active: document.getElementById('gridSwitch').querySelector('input').checked,
        data: jsonToFunction(data, 'ts', 'feedinpower')
    }, {
        label: "battery",
        color: "#3ccf2c",
        active: document.getElementById('batterySwitch').querySelector('input').checked,
        data: jsonToFunction(data, 'ts', 'battery')
    }, {
        label: "consumption",
        color: "#553ffb",
        active: document.getElementById('houseSwitch').querySelector('input').checked,
        data: jsonToFunction(data, 'ts', 'consumption')
    }, {
        label: "debug",
        color: "#553ffb",
        active: false,
        data: [{
            x: 10,
            y: -10
        }, {
            x: 60,
            y: 200
        }]
    }]
    console.log(datasets)

    loadGraph()
}

function getMax(arr, prop, active) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if ((max == null || parseInt(arr[i][prop]) > parseInt(max[prop])) && (!active || arr[i]['active']))
            max = arr[i];
    }
    if (max == null) {
        return {
            max: 10,
            y: 10
        }
    }
    return max;
}

function getMin(arr, prop, active) {
    var min;
    for (var i = 0; i < arr.length; i++) {
        if ((min == null || parseInt(arr[i][prop]) < parseInt(min[prop])) && (!active || arr[i]['active']))
            min = arr[i];
    }
    if (min == null) {
        return {
            min: 0,
            y: 0
        }
    }
    return min;
}

function convertY(y, range) {
    return 95 - (y - range.bottom) / range.difference * 90
}

function convertX(percent) {
    return 20 + percent * 180 / 100
}

function loadGraph() {
    document.getElementById('lines').innerHTML = ''
    for (let i = 0; i < datasets.length; i++) {
        let obj = datasets[i];
        obj.max = getMax(obj.data, 'y').y
        obj.min = getMin(obj.data, 'y').y
        obj.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
        });
        // console.log(obj);
    }
    overAllMax = getMax(datasets, 'max', true).max
    overAllMin = getMin(datasets, 'min', true).min
    range = {
        top: overAllMax,
        bottom: overAllMin > 0 ? 0 : overAllMin,
        difference: overAllMax - (overAllMin > 0 ? 0 : overAllMin)
    }
    console.log('overAllMax ' + overAllMax)
    console.log('overAllMin ' + overAllMin)
    console.log(range)
    document.getElementById('maxY').innerHTML = range.top
    document.getElementById('minY').innerHTML = range.bottom
    document.getElementById('halfY').innerHTML = Math.round(overAllMax / 2)
    document.getElementById('halfY').setAttribute('y', convertY(Math.round(overAllMax / 2), range) + 2)
    document.getElementById('negHalfY').innerHTML = Math.round(range.bottom / 2)
    document.getElementById('negHalfY').setAttribute('y', convertY(Math.round(range.bottom / 2), range) + 2)
    document.getElementById('zeroYLine').setAttribute('d', 'M20 ' + convertY(0, range) + ' l215 0')
    document.getElementById('zeroY').setAttribute('y', convertY(0, range))
    document.getElementById('halfYdash').setAttribute('d', 'M20 ' + convertY(Math.round(overAllMax / 2), range) + ' l215 0')
    document.getElementById('negHalfYdash').setAttribute('d', 'M20 ' + convertY(Math.round(range.bottom / 2), range) + ' l215 0')
    console.log('% negHalfY ' + (-Math.round(range.bottom / 2) / range.difference))
    if (-Math.round(range.bottom / 2) / range.difference < 0.1) {
        document.getElementById('negHalfYdash').style.visibility = 'hidden'
        document.getElementById('negHalfY').style.visibility = 'hidden'
    } else {
        document.getElementById('negHalfYdash').style.visibility = 'visible'
        document.getElementById('negHalfY').style.visibility = 'visible'
    }
    if (Math.round(range.top / 2) / range.difference < 0.1) {
        document.getElementById('halfYdash').style.visibility = 'hidden'
        document.getElementById('halfY').style.visibility = 'hidden'
    } else {
        document.getElementById('halfYdash').style.visibility = 'visible'
        document.getElementById('halfY').style.visibility = 'visible'
    }
    for (let i = 0; i < datasets.length; i++) {
        let obj = datasets[i];
        if (obj.active) {
            points = '20,' + convertY(obj.data[0].y, range)
            for (let k = 0; k < obj.data.length; k++) {
                points += ' ' + convertX(obj.data[k].x) + ',' + convertY(obj.data[k].y, range)
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