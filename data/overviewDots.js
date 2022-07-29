const duration = 2
const ease = "power1.out"

tl_solar = null
tl_house = null
tl_battery = null
tl_grid = null

function updateDots(data) {
    // console.log(data)
    // console.log(tl_house)
    if (tl_house != null) {
        tl_house.restart();
        tl_house.kill()
    }
    tl_house = gsap.to('.houseCircle', {
            y: 50,
            x: 50,
            repeat: -1,
            duration: duration,
            ease: ease
        })
        // console.log(tl_house)

    solar = data.powerdc1 + data.powerdc2
    if (tl_solar != null) {
        tl_solar.restart();
        tl_solar.kill()
    }
    if (solar > 1) {
        tl_solar = gsap.to('.solarCircle', {
            y: 50,
            x: 50,
            repeat: -1,
            duration: duration,
            ease: ease,
            delay: duration / 2
        })

    }

    battery = data.bmsBatPower
    if (tl_battery != null) {
        tl_battery.restart();
        tl_battery.kill()
    }
    if (battery < 0) {
        document.querySelector('.batteryCircle').setAttribute('cx', '100')
        document.querySelector('.batteryCircle').setAttribute('cy', '0')
        tl_battery = gsap.to('.batteryCircle', {
            y: 50,
            x: -50,
            repeat: -1,
            duration: duration,
            ease: ease,
            delay: duration / 2
        })

    } else if (battery > 0) {
        document.querySelector('.batteryCircle').setAttribute('cx', '50')
        document.querySelector('.batteryCircle').setAttribute('cy', '50')
        tl_battery = gsap.to('.batteryCircle', {
            y: -50,
            x: 50,
            repeat: -1,
            duration: duration,
            ease: ease,
            delay: duration / 2
        })

    }

    grid = -data.feedinpower
    if (tl_grid != null) {
        tl_grid.restart();
        tl_grid.kill()
    }
    if (grid < 0) {
        document.querySelector('.gridCircle').setAttribute('cx', '50')
        document.querySelector('.gridCircle').setAttribute('cy', '50')
        tl_grid = gsap.to('.gridCircle', {
            y: 50,
            x: -50,
            repeat: -1,
            duration: duration,
            ease: ease
        })
    } else if (grid > 0) {
        document.querySelector('.gridCircle').setAttribute('cx', '0')
        document.querySelector('.gridCircle').setAttribute('cy', '100')
        tl_grid = gsap.to('.gridCircle', {
            y: -50,
            x: 50,
            repeat: -1,
            duration: duration,
            ease: ease,
            delay: duration / 2
        })
    }
    // console.log(timelines)
}