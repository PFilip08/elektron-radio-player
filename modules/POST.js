import {logger} from "./Logger.js";
import {massSchedule} from "./TaskScheduler.js";
import {checkUpdate} from "./ApiConnector.js";
import {default as www} from "../api/app.js";

async function POST() {
    logger('POST', '------------------------------')
    logger('POST', '    elektron-radio-player')
    logger('POST', '        By PFilip :>')
    logger('POST', '------------------------------')
    if (process.platform === "win32") {
        logger('error', 'okna niedozwolone');
        return process.exit(2);
    }
    if (process.env.WWW) {
        logger('task', 'Aktywowanie lokalnego API', 'POST');
        www();
    }
    logger('task', 'Planowanie zadań…', 'POST');
    await massSchedule();
    logger('task', 'Aktywowanie automatycznych aktualizacji z API', 'POST');
    await checkUpdate();
    setInterval(() => {
        checkUpdate().catch(error => {
            console.log(error);
        });
    }, 10000);
    logger('ready', 'Git');
}

export { POST };