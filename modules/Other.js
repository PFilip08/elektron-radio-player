import {DebugSaveToFile} from "./DebugMode.js";
import {logger} from "./Logger.js";
import path from 'path';
import colors from 'colors';
import ps from "ps-node";
import {exec} from "child_process";
import fs from "fs";
import VLC from "vlc-client";

function sterylizator(input) {
    let sterilised = '';
    logger('verbose', `Sterylizacja tekstu: ${input}`, 'sterylizator');
    if (global.debugmode === true) {
        DebugSaveToFile('Other', 'sterylizator', 'source', input);
        logger('verbose', 'Tekst źródłowy zapisany do debug/', 'sterylizator');
    }
    try {
        sterilised = input.split(' ').join('_').replace(/[^a-zA-Z_0-9-\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g, "");
    } catch (e) {
        logger('error', `Wystąpił błąd podczas sterylizacji tekstu: ${e}`, 'sterylizator');
        if (global.debugmode === true) {
            DebugSaveToFile('Other', 'sterylizator', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'sterylizator');
        }
        sterilised = '';
    }
    if (global.debugmode === true) {
        DebugSaveToFile('Other', 'sterylizator', 'result', sterilised);
        logger('verbose', `Zwrócono wynik sterylizacji do debug/`, 'sterylizator');
    }
    return sterilised;
}

function pathSecurityChecker(filepath) {
    // Sprawdza czy ścieżka nie może wykonać Path Travels
    logger('verbose', `Sprawdzanie bezpieczeństwa ścieżki: ${filepath}`, 'pathSecurityChecker');
    if (global.debugmode === true) {
        DebugSaveToFile('Other', 'pathSecurityChecker', 'source', filepath);
        logger('verbose', 'Ścieżka źródłowa zapisana do debug/', 'pathSecurityChecker');
    }
    logger('verbose', 'Sprawdzanie czy ścieżka nie zawiera NULL_BYTE', 'pathSecurityChecker');
    if (filepath.indexOf('\0') !== -1) {
        logger('warn', colors.yellow(`Próba użycia NULL_BYTE w ścieżce!!!`), 'pathSecurityChecker');
        return 'NULL_BYTE_ATTEMPT';
    }
    logger('verbose', 'Sprawdzanie czy ścieżka nie wiedzie do ucieczki z głównego folderu', 'pathSecurityChecker');
    const rootDirectory = path.resolve(process.cwd(), 'mp3');
    const filename = path.join(rootDirectory, filepath);
    if (filename.indexOf(rootDirectory) !== 0) {
        logger('warn', colors.yellow(`Próba wyjścia poza katalog główny mp3!!!`), 'pathSecurityChecker');
        return 'ROOT_EXIT_ATTEMPT';
    }
    logger('verbose', 'Sprawdzanie czy ścieżka nie zawiera dwukropków', 'pathSecurityChecker');
    if (!/^[a-zA-Z0-9/._-]+$/.test(filepath)) {
        logger('warn', colors.yellow(`Próba wyjścia poza katalog główny przy użyciu dwukropków!!!`), 'pathSecurityChecker');
        return 'ESCAPE_PATH_ATTEMPT';
    }
    return 'NONE'
}

function killVLCatStartup() {
    ps.lookup({
        command: 'vlc',
        psargs: 'ux'
    }, function(err, resultList ) {
        if (err) {
            if (global.debugmode === true) {
                DebugSaveToFile('Other','killVLCatStartup','catched_error', err);
                logger('verbose',`Stacktrace został zrzucony do debug/`,'killVLCatStartup');
            }
            return logger('error', 'Błąd przy ubijaniu VLC', 'killVLCatStartup');
        }

        resultList.forEach(function( process ){
            if (process) {
                logger('verbose',`PID: ${process.pid}, COMMAND: ${process.command}, ARGUMENTS: ${process.arguments}`,'killVLCatStartup');
                if (global.debugmode === true) {
                    DebugSaveToFile('Other','killVLCatStartup','process',`PID: ${process.pid}, COMMAND: ${process.command}, ARGUMENTS: ${process.arguments}`);
                    logger('verbose',`Dane zostały zrzucone`,'killVLCatStartup');
                }
                logger('task', 'Ubito VLC.', 'killVLCatStartup');
                exec('pkill -9 vlc');
            }
        });
    });
}

function checkIfVLCisRunning() {
    return new Promise((resolve, reject) => {
        ps.lookup({
            command: 'vlc',
            psargs: 'ux'
        }, (err, resultList) => {
            if (err) {
                if (global.debugmode === true) {
                    DebugSaveToFile('Other', 'checkIfVLCisRunning', 'catched_error', err);
                    logger('verbose', 'Stacktrace został zrzucony do debug/', 'checkIfVLCisRunning');
                }
                logger('error', 'Błąd przy ubijaniu VLC', 'checkIfVLCisRunning');
                return reject(err);
            }

            const isVlcRunning = resultList.some(process => {
                if (process) {
                    logger('verbose', `PID: ${process.pid}, COMMAND: ${process.command}, ARGUMENTS: ${process.arguments}`, 'checkIfVLCisRunning');
                    logger('task', 'VLC istnieje.', 'checkIfVLCisRunning');
                    return true;
                } else {
                    logger('task', 'VLC nie jest uruchomiony.', 'checkIfVLCisRunning');
                    return false;
                }
            });

            if (!isVlcRunning) {

            }

            resolve(isVlcRunning);
        });
    });
}

async function checkIfVLConVotes() {
    try {
        const vlc = new VLC.Client({
            ip: '127.0.0.1',
            port: Number(process.env.VLC_PORT) || 4212,
            password: process.env.VLC_PASSWORD
        });
        return fs.existsSync('./mp3/7/'+await vlc.getFileName());
    } catch (e) {
        return false;
    }
}

export { sterylizator, pathSecurityChecker, killVLCatStartup, checkIfVLCisRunning, checkIfVLConVotes };