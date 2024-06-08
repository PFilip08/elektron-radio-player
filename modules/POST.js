import {logger} from "./Logger.js";
import {massSchedule} from "./TaskScheduler.js";
import {checkUpdate} from "./ApiConnector.js";

async function POST() {
    logger('POST', '------------------------------')
    logger('POST', '    elektron-radio-player')
    logger('POST', '        By PFilip :>')
    logger('POST', '------------------------------')
    /*
    if (process.platform === "win32") {
        logger('error', 'okna niedozwolone');
        return process.exit(2);
    }
    */
    logger('task', 'Planowanie zadań…', 'POST');
    await massSchedule();
    logger('task', 'Aktywowanie automatycznych aktualizacji z API', 'POST');
    checkUpdate();
    setInterval(() => {
        checkUpdate().catch(error => {
            console.log(error);
        });
    }, 10000);
    logger('ready', 'Git');
}

export { POST };