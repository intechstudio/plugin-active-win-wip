const activeWindow = require('active-win');

let interval = 1000
let pageActivatorCriteria_0 = ''
let pageActivatorCriteria_1 = ''
let pageActivatorCriteria_2 = ''
let pageActivatorCriteria_3 = ''
let lastPageActivator = ''
let isEnabled = false
let currentTimeoutId = undefined
let controller = undefined

exports.loadPlugin = async function(gridController, persistedData) {
    controller = gridController
    interval = persistedData?.interval ?? 1000
    pageActivatorCriteria_0 = persistedData?.pageActivatorCriteria_0 ?? 'Editor'
    pageActivatorCriteria_1 = persistedData?.pageActivatorCriteria_1 ?? 'Discord'
    pageActivatorCriteria_2 = persistedData?.pageActivatorCriteria_2 ?? 'Firefox'
    pageActivatorCriteria_3 = persistedData?.pageActivatorCriteria_3 ?? ''
    isEnabled = true
    runLoop()
    
    return true
}

exports.unloadPlugin = async function() {
    controller = undefined
    cancelLoop()
}

exports.executeAction = async function(actionId, payload) {
    if (actionId == 0){
        cancelLoop()

        interval = payload.interval;
        pageActivatorCriteria_0 = payload.pageActivatorCriteria_0
        pageActivatorCriteria_1 = payload.pageActivatorCriteria_1
        pageActivatorCriteria_2 = payload.pageActivatorCriteria_2
        pageActivatorCriteria_3 = payload.pageActivatorCriteria_3
        isEnabled = true
        
        controller.sendMessageToRuntime({
            id : 'persist-data',
            data : {
                interval,
                pageActivatorCriteria_0,
                pageActivatorCriteria_1,
                pageActivatorCriteria_2,
                pageActivatorCriteria_3
            }
        })

        runLoop()
    } else if (actionId == 1){
        return {
            interval,
            pageActivatorCriteria_0,
            pageActivatorCriteria_1,
            pageActivatorCriteria_2,
            pageActivatorCriteria_3
        }
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
            pageActivatorCriteria_0,
            pageActivatorCriteria_1,
            pageActivatorCriteria_2,
            pageActivatorCriteria_3,
        ];

        for (let i = 0; i < 4; i++) {
            if (criteria[i] === result.owner.name) {
            lastPageActivator = result.owner.name;

            controller.sendMessageToRuntime({
                id : 'change-page',
                num : i,
                debugActiveWin : {
                    owner: result.owner,
                    title: result.title
                }
            })
            return;
            }
        }

        // default to page 0 if not found
        lastPageActivator = result.owner.name;
        controller.sendMessageToRuntime({
            id : 'change-page',
            num : 0
        })
        } catch (e) {
            controller.sendMessageToRuntime({
                error : JSON.stringify(e)
            })
    }
}

function cancelLoop(){
    isEnabled = false
    clearTimeout(currentTimeoutId)
}
