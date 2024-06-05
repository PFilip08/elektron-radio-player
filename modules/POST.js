import {logger} from "./Logger.js";
import {massSchedule} from "./TaskScheduler.js";
import {checkUpdate} from "./ApiConnector.js";

async function POST() {
    logger('POST', '------------------------------')
    logger('POST', '    elektron-radio-player')
    logger('POST', '        By PFilip :>')
    logger('POST', '------------------------------')
    if (process.platform === "win32") {
        logger('error', 'okna niedozwolone');
        return process.exit(2);
    }
    logger('task', 'Scheduling tasks…', 'POST');
    await massSchedule();
    logger('task', 'Activating auto update data from API', 'POST');
    logger('ready', 'Git');
    checkUpdate();
    setInterval(() => {
        checkUpdate().catch(error => {
            console.log(error);
        });
    }, 10000);
}

export {POST};