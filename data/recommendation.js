var descs = [{
    desc: "nein",
    color: "#FF5467"
}, {
    desc: "schwach",
    color: "#FBB13F"
}, {
    desc: "stark",
    color: "#11AB73"
}]

function setRecomm(elementId, degree) {
    document.getElementById(elementId).children.item(1).innerHTML = descs[degree].desc
    document.getElementById(elementId).children.item(1).style.color = descs[degree].color
}

function updateRecomms(data) {
    var times = SunCalc.getTimes(new Date(), 49.481220, 11.071675);
    var hoursSunset = (times.sunset - new Date()) / 36e5;
    // console.log('sunset in (h): ' + hoursSunset)
    var hoursSunrise = (times.sunrise - new Date()) / 36e5;
    // console.log('sunrise in (h): ' + hoursSunrise)

    if (data.feedinpower > 500 && hoursSunset > 2 && hoursSunrise < -2) {
        setRecomm('washRecomm', 2)
    } else if (hoursSunset > 2 && hoursSunrise < -2) {
        setRecomm('washRecomm', 1)
    } else {
        setRecomm('washRecomm', 0)
    }
}