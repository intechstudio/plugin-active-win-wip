const activeWindow = require('active-win');

exports.loadPlugin = async function(controller) {
    controller.addAction('Get Active Window', 0)
}

exports.executeAction = async function(actionId, controller) {
    if (actionId == 0){
        var activeWindowResult = await activeWindow()
        controller.sendMessage(JSON.stringify(activeWindowResult))
    }
}