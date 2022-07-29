const duration = 2
const ease = "power1.out"

function updateDots(data) {
    gsap.timeline({
        defaults: { duration: duration, opacity: 1, ease: ease },
        repeat: -1
    }).to('.houseCircle', { y: 50, x: 50 })

    solar = data.powerdc1 + data.powerdc2
    if (solar > 1) {
        gsap.timeline({
            defaults: { duration: duration, opacity: 1, ease: ease },
            repeat: -1
        }).to('.solarCircle', { y: 50, x: 50 }).delay(1)
    }

    battery = data.bmsBatPower
    if (battery < 0) {
        document.querySelector('.batteryCircle').setAttribute('cx', '100')
        document.querySelector('.batteryCircle').setAttribute('cy', '0')
        gsap.timeline({
            defaults: { duration: duration, opacity: 1, ease: ease },
            repeat: -1
        }).to('.batteryCircle', { y: 50, x: -50 })
    } else if (battery > 0) {
        document.querySelector('.batteryCircle').setAttribute('cx', '50')
        document.querySelector('.batteryCircle').setAttribute('cy', '50')
        gsap.timeline({
            defaults: { duration: duration, opacity: 1, ease: ease },
            repeat: -1
        }).to('.batteryCircle', { y: -50, x: 50 })
    }

    grid = -data.feedinpower
    if (grid < 0) {
        document.querySelector('.gridCircle').setAttribute('cx', '50')
        document.querySelector('.gridCircle').setAttribute('cy', '50')
        gsap.timeline({
            defaults: { duration: duration, opacity: 1, ease: ease },
            repeat: -1
        }).to('.gridCircle', { y: 50, x: -50 })
    } else if (grid > 0) {
        document.querySelector('.gridCircle').setAttribute('cx', '0')
        document.querySelector('.gridCircle').setAttribute('cy', '100')
        gsap.timeline({
            defaults: { duration: duration, opacity: 1, ease: ease },
            repeat: -1
        }).to('.gridCircle', { y: -50, x: 50 }).delay(1)
    }
}