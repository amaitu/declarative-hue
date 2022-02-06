const getBrightness = () => {
    let transitionHour = 19 // Time in the evening when the lights begin to dim.
    let sunriseHour = 6  // Time in the morning when the lights return to peak brightness.

    const maxSettings = { // % Brightness levels at peak brightness.
        medium: 100,
        dim: 100,
        veryDim: 100,
    }

    const minSettings = { // % Brightness levels at dim brightness. Can assign rooms to profiles, e.g. bedroom to veryDim.
        medium: 60,
        dim: 40,
        veryDim: 1,
    }

    const date = new Date()
    const currentHours = date.getHours()
    const currentMinutes = date.getMinutes()

    if (currentHours === transitionHour) {
        console.log(`it's currently transitionHour (${transitionHour})`)
        console.log('setting graded dimness')
        return {
            medium: maxSettings["medium"] - Math.round((100 - minSettings["medium"]) * (currentMinutes / 60)),
            dim: maxSettings["dim"] - Math.round((100 - minSettings["dim"]) * (currentMinutes / 60)),
            veryDim: maxSettings["veryDim"] - Math.round((100 - minSettings["veryDim"]) * (currentMinutes / 60)),
        }
    }

    if ((currentHours > sunriseHour) && (currentHours < transitionHour)) {
        console.log('setting full brightness')
        return maxSettings
    }

    console.log('setting peak dimness')
    return minSettings
};

const handleSchedule = async () => {
    const autoDimmingPausedUntil = await LIGHTSETTINGS.get('autoDimmingPausedUntil')
    const autoDimmingPausedUntilDate = new Date(parseInt(autoDimmingPausedUntil))
    if (autoDimmingPausedUntilDate > new Date()) {
        console.log('Paused until ' + autoDimmingPausedUntilDate)
        return
    }

    let brightness = getBrightness()

    console.log(`Set brightness levels to medium: ${brightness['medium']}%, dim: ${brightness['dim']}%, veryDim: ${brightness['veryDim']}%`)
    await fetch(WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
            "value1": brightness['medium'],
            "value2": brightness['dim'],
            "value3": brightness['veryDim']
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
};

addEventListener("scheduled", event => {
    event.waitUntil(handleSchedule(event))
})
