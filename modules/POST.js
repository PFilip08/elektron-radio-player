import {logger} from "./Logger.js";
import {massSchedule} from "./TaskScheduler.js";
import {checkUpdate, scheduleUpdate} from "./ApiConnector.js";
import {default as www} from "../api/app.js";
import colors from 'colors';
import fs from "fs";

async function POST() {
    logger('POST', '------------------------------')
    logger('POST', '    elektron-radio-player')
    logger('POST', '        By PFilip :>')
    logger('POST', '------------------------------')
    if (process.env.VERBOSE === "true") {
        logger('verbose', 'WŁĄCZONO TRYB DEBUGOWANIA!!!', 'POST');
        global.debugmode = true;
        fs.mkdirSync('./debug', { recursive: true }, (e) => {
            logger('verbose', colors.red('Nie można utworzyć folderu debug'), 'POST');
            console.log(e);
            logger('verbose', colors.red('Wywalanie procesu z kodem 2'), 'POST');
            process.exit(2);
        });
    } else {
        if (fs.existsSync('./debug')) {
            logger('log', 'Usunięto folder debug', 'POST');
            fs.rmSync('./debug', { recursive: true }, (e) => {});
        }
    }
    logger('verbose', 'Następujące ustawienia są załadowane:', 'POST');
    logger('verbose', `  - VERBOSE: ${process.env.VERBOSE}`, 'POST');
    logger('verbose', `  - WWW: ${process.env.WWW}`, 'POST');
    logger('verbose', `Następujące klucze zostały załadowane:`, 'POST');
    if (process.env.SPOTIFY_CLIENT_ID === undefined) {
        logger('verbose', colors.red('Nie znaleziono zmiennej środowiskowej o nazwie SPOTIFY_CLIENT_ID'), 'POST');
    }
    if (process.env.SPOTIFY_CLIENT_SECRET === undefined) {
        logger('verbose', colors.red('Nie znaleziono zmiennej środowiskowej o nazwie SPOTIFY_CLIENT_SECRET'), 'POST');
    }
    logger('verbose', `Wykryto system: ${process.platform}`, 'POST');
    /*if (process.platform === "win32") {
        logger('verbose', 'System Windows nie jest obsługiwany', 'POST');
        logger('error', 'okna niedozwolone');
        logger('verbose', 'Wywalanie procesu z kodem 2', 'POST');
        return process.exit(2);
    }*/
    if (process.env.WWW) {
        logger('task', 'Aktywowanie lokalnego API', 'POST');
        www();
    }
    logger('task', 'Planowanie zadań…', 'POST');
    await massSchedule();
    logger('task', 'Aktywowanie automatycznych aktualizacji z API', 'POST');
    await checkUpdate();
    setInterval(() => {
        scheduleUpdate();
    }, 1000);
    logger('ready', 'Git');
}

export { POST };