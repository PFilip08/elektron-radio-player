import {logger} from "./Logger.js";
import colors from 'colors';
import fs from "fs";

async function DebugStarter() {
    if (process.env.VERBOSE === "true") {
        logger('verbose', 'WŁĄCZONO TRYB DEBUGOWANIA!!!', 'DebugStarter');
        global.debugmode = true;
        fs.mkdirSync('./debug', { recursive: true }, (e) => {
            logger('verbose', colors.red('Nie można utworzyć folderu debug'), 'DebugStarter');
            console.log(e);
            logger('verbose', colors.red('Wywalanie procesu z kodem 2'), 'DebugStarter');
            process.exit(2);
        });
    } else {
        global.debugmode = false;
        if (fs.existsSync('./debug')) {
            logger('log', 'Usunięto folder debug', 'DebugStarter');
            fs.rmSync('./debug', { recursive: true });
        }
    }
    logger('verbose', 'Następujące ustawienia są załadowane:', 'DebugStarter');
    logger('verbose', `  - VERBOSE: ${process.env.VERBOSE}`, 'DebugStarter');
    logger('verbose', `  - WWW: ${process.env.WWW}`, 'DebugStarter');
    if (process.env.SPOTIFY_CLIENT_ID === undefined) {
        logger('verbose', colors.red('Nie znaleziono zmiennej środowiskowej o nazwie SPOTIFY_CLIENT_ID'), 'POST');
    }
    if (process.env.SPOTIFY_CLIENT_SECRET === undefined) {
        logger('verbose', colors.red('Nie znaleziono zmiennej środowiskowej o nazwie SPOTIFY_CLIENT_SECRET'), 'POST');
    }
}

function DebugSaveToFile(moduleName, functionName, fileName, data) {
    let dataType = '';
    if (global.debugmode === false) {
        logger('error', colors.red('DebugSaveToFile zostało wywołane, ale debugmode jest wyłączony'), 'DebugSaveToFile');
        throw new Error('DebugSaveToFile was called, but debugmode is off');
    }
    if (data === undefined) {
        logger('verbose', colors.red('Brak danych do zapisania'), 'DebugSaveToFile');
        return;
    }
    if (data.stack) {
        dataType = 'STACK';
        logger('verbose', colors.red(`Zapisywane dane to stack error z funckji ${functionName}`), 'DebugSaveToFile');
    } else {
        try {
            if (JSON.parse(JSON.stringify(data))) {
                dataType = 'JSON';
                logger('verbose', colors.red(`Zapisywane dane to JSON z funckji ${functionName}`), 'DebugSaveToFile');
            }
        } catch (e) {
            console.log(e);
            logger('verbose', colors.red('Zapisywane dane nie są JSONem'), 'DebugSaveToFile');
        }
    }
    fs.mkdirSync(`./debug/${moduleName}/${functionName}/`, { recursive: true }, (e) => {
        logger('verbose', colors.red(`Nie można utworzyć folderu /debug/${moduleName}/${functionName}/`), 'DebugSaveToFile');
        console.log(e);
    });
    if (dataType === 'JSON') {
        if (functionName === 'logChanges') {
            fs.appendFileSync(`./debug/${moduleName}/${functionName}/${fileName}.json`, JSON.stringify(data, null, 4) + '\n', 'utf8', (e) => {
                logger('verbose', colors.red(`Nie można zapisać pliku ${fileName}.json`), 'DebugSaveToFile');
                console.log(e);
            });
            return;
        } else {
            fs.writeFileSync(`debug/${moduleName}/${functionName}/${fileName}.json`, JSON.stringify(data, null, 4), 'utf8', (e) => {
                logger('verbose', colors.red(`Nie można zapisać pliku ${fileName}.json`), 'DebugSaveToFile');
                console.log(e);
            })
            return;
        }
    }
    if (dataType === 'STACK') {
        //console.log(data.stack);
        fs.writeFileSync(`debug/${moduleName}/${functionName}/${fileName}.txt`, String(data.stack), 'utf8', (e) => {
            logger('verbose', colors.red(`Nie można zapisać pliku ${fileName}.txt`), 'DebugSaveToFile');
            console.log(e);
        });
    }
    else {
        logger('verbose', colors.red('Nie można rozpoznać typu danych do zapisania'), 'DebugSaveToFile');
        console.log(data);
        process.exit(1);
    }
}

export { DebugSaveToFile, DebugStarter };