const activeWindow = require('active-win');

let interval = 1000
let pageActivatorCriteria0 = ''
let pageActivatorCriteria1 = ''
let pageActivatorCriteria2 = ''
let pageActivatorCriteria3 = ''
let lastPageActivator = ''
let isEnabled = false
let currentTimeoutId = undefined
let controller = undefined

let messagePorts = new Set()

exports.loadPlugin = async function(gridController, persistedData) {
    controller = gridController
    interval = persistedData?.interval ?? 1000
    pageActivatorCriteria0 = persistedData?.pageActivatorCriteria0 ?? ''
    pageActivatorCriteria1 = persistedData?.pageActivatorCriteria1 ?? ''
    pageActivatorCriteria2 = persistedData?.pageActivatorCriteria2 ?? ''
    pageActivatorCriteria3 = persistedData?.pageActivatorCriteria3 ?? ''
    isEnabled = true
    runLoop()
    
    return true
}

exports.unloadPlugin = async function() {
    controller = undefined
    messagePorts.forEach((port) => port.close())
    messagePorts.clear()
    cancelLoop()
}

exports.addMessagePort = async function(port) {
    port.on("message", (e) => {
        onMessage(port, e.data)
    })
    
    messagePorts.add(port)
    port.on("close", () => {
        messagePorts.delete(port)
    })
    port.start()
}

async function onMessage(port, data) {
    if (data.type === 'request-configuration'){
        port.postMessage({
            type: 'configuration',
            interval,
            pageActivatorCriteria0,
            pageActivatorCriteria1,
            pageActivatorCriteria2,
            pageActivatorCriteria3
        })
    } else if (data.type === 'save-configuration') {
        cancelLoop()

        interval = data.interval ?? interval
        pageActivatorCriteria0 = data.pageActivatorCriteria0 ?? pageActivatorCriteria0
        pageActivatorCriteria1 = data.pageActivatorCriteria1 ?? pageActivatorCriteria1
        pageActivatorCriteria2 = data.pageActivatorCriteria2 ?? pageActivatorCriteria2
        pageActivatorCriteria3 = data.pageActivatorCriteria3 ?? pageActivatorCriteria3
        isEnabled = true
        
        controller.sendMessageToRuntime({
            id : 'persist-data',
            data : {
                interval,
                pageActivatorCriteria0,
                pageActivatorCriteria1,
                pageActivatorCriteria2,
                pageActivatorCriteria3
            }
        })

        await runLoop()
    }
}

async function runLoop(){
    if (!isEnabled) return

    await checkActiveWindow()

    currentTimeoutId = setTimeout(runLoop, Math.max(interval ?? 0, 100))
}

async function checkActiveWindow(){
    try{
        let result = await activeWindow();

        if (result === undefined) {
            result = { owner: { name: "Unknown!" }, title: "Invalid title!" };
        }

        if (lastPageActivator === result.owner.name) {
            return;
        }

        let criteria = [
            pageActivatorCriteria0,
            pageActivatorCriteria1,
            pageActivatorCriteria2,
            pageActivatorCriteria3,
        ];

        for (let i = 0; i < 4; i++) {
            if (criteria[i] === result.owner.name) {
            lastPageActivator = result.owner.name;

            controller.sendMessageToRuntime({
                id : 'change-page',
                num : i
            })
            for (const port of messagePorts){
                port.postMessage({
                    type: "active-info",
                    owner: result.owner,
                    title: result.title
                })
            }
            return;
            }
        }

        // default to page 0 if not found
        lastPageActivator = result.owner.name;
        controller.sendMessageToRuntime({
            id : 'change-page',
            num : 0
        })
        
        for (const port of messagePorts){
            port.postMessage({
                type: "active-info",
                owner: result.owner,
                title: result.title
            })
        }
        } catch (e) {
            controller.sendMessageToRuntime({
                error : e.message
            })
    }
}

function cancelLoop(){
    isEnabled = false
    clearTimeout(currentTimeoutId)
}
