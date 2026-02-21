import {logger} from "./Logger.js";
import fs from "fs";
import {yellow, red} from 'colorette';

async function DebugStarter() {
    if (process.env.VERBOSE === "true") {
        logger('verbose', 'WŁĄCZONO TRYB DEBUGOWANIA!!!', 'DebugStarter');
        global.debugmode = true;
        try {
            fs.mkdirSync('./debug', { recursive: true });
        } catch (e) {
            logger('verbose', red('Nie można utworzyć folderu debug'), 'DebugStarter');
            console.log(e);
            logger('verbose', red('Wywalanie procesu z kodem 2'), 'DebugStarter');
            process.exit(2);
        }
    } else {
        global.debugmode = false;
        if (fs.existsSync('./debug')) {
            logger('log', 'Usunięto folder debug', 'DebugStarter');
            fs.rmSync('./debug', { recursive: true });
        }
    }
    try {
        logger('verbose', 'Następujące ustawienia są załadowane:', 'DebugStarter');
        logger('verbose', `  - VERBOSE: ${process.env.VERBOSE || 'Jak Ty tu wogóle doszedłeś?'}`, 'DebugStarter');
        logger('verbose', `  - WWW: ${process.env.WWW || 'nie ustawiono'}`, 'DebugStarter');
        logger('verbose', `  - KILL_AT_STARTUP: ${process.env.KILL_AT_STARTUP || 'nie ustawiono'}`, 'DebugStarter');
        logger('verbose', `  - PORT (Local API): ${process.env.PORT || 'nie ustawiono'}`, 'DebugStarter');
        logger('verbose', `  - VLC_PORT: ${process.env.VLC_PORT || 'nie ustawiono'}`, 'DebugStarter');
        logger('verbose', `  - ARCHIVE_DIR: ${process.env.ARCHIVE_DIR || 'nie ustawiono'}`, 'DebugStarter');
        if (process.env.URI === undefined) {
            logger('verbose', red('Nie znaleziono zmiennej środowiskowej o nazwie URI! Player nie będzie bez tego funkcjonował!'), 'DebugStarter');
            throw new Error('Nie można znaleźć zmiennej środowiskowej URI');
        }
        logger('verbose', `  - URI: ${process.env.URI}`, 'DebugStarter');
        if (process.env.SPOTIFY_CLIENT_ID === undefined) {
            logger('verbose', red('Nie znaleziono zmiennej środowiskowej o nazwie SPOTIFY_CLIENT_ID. Bez tego MusicDownloader nie będzie działał poprawnie!'), 'DebugStarter');
            throw new Error('Nie można znaleźć zmiennej środowiskowej SPOTIFY_CLIENT_ID');
        }
        if (process.env.SPOTIFY_CLIENT_SECRET === undefined) {
            logger('verbose', red('Nie znaleziono zmiennej środowiskowej o nazwie SPOTIFY_CLIENT_SECRET. Bez tego MusicDownloader nie będzie działał poprawnie!'), 'DebugStarter');
            throw new Error('Nie można znaleźć zmiennej środowiskowej SPOTIFY_CLIENT_SECRET');
        }
        if (process.env.VLC_PASSWORD === undefined) {
            logger('verbose', red('Nie znaleziono zmiennej środowiskowej o nazwie VLC_PASSWORD! Bez tego VLC nie będzie działał!'), 'DebugStarter');
            throw new Error('Nie można znaleźć zmiennej środowiskowej VLC_PASSWORD');
        }
    } catch (e) {
        logger('error', red('Użyszkodniku nie zapomniałeś przypadkiem przeczytać README.md i ogarnąć plik .env?'), 'DebugStarter');
        console.log(e);
        logger('verbose', red('Wywalanie procesu z kodem 2'), 'DebugStarter');
        process.exit(2);
    }
}

function DebugSaveToFile(moduleName, functionName, fileName, data) {
    let dataType = '';
    if (global.debugmode === false) {
        logger('error', red('DebugSaveToFile zostało wywołane, ale debugmode jest wyłączony'), 'DebugSaveToFile');
        throw new Error('DebugSaveToFile was called, but debugmode is off');
    }
    if (data === undefined) {
        logger('verbose', red(`Brak danych do zapisania. Wywołanie z funkcji ${functionName}`), 'DebugSaveToFile');
        return;
    }
    if (data === null) {
        logger('verbose', red(`Brak danych do zapisania! Data jest NULL!!!. Wywołanie z funkcji ${functionName}`), 'DebugSaveToFile');
        return;
    }
    if (data === '') {
        logger('verbose', red(`Brak danych do zapisania! Pusty String!. Wywołanie z funkcji ${functionName}`), 'DebugSaveToFile');
        return;
    }
    if (data.stack) {
        dataType = 'STACK';
        logger('verbose', red(`Zapisywane dane to stacktrace errora z funkcji ${functionName}`), 'DebugSaveToFile');
    } else {
        try {
            try {
                if (JSON.parse(JSON.stringify(data))) {
                    dataType = 'JSON';
                    logger('verbose', red(`Zapisywane dane to JSON z funkcji ${functionName}`), 'DebugSaveToFile');
                }
            } catch (e) {
                if (removeCircularReferences(data)) {
                    dataType = 'ChińskiJSON';
                    logger('verbose', red(`Zapisywane dane to JSON z cyklami z funkcji ${functionName}`), 'DebugSaveToFile');
                }
            }
        } catch (e) {
            console.log(e);
            logger('verbose', red('Zapisywane dane nie są JSONem'), 'DebugSaveToFile');
        }
    }
    try {
        fs.mkdirSync(`./debug/${moduleName}/${functionName}/`, { recursive: true });
    } catch (e) {
        logger('verbose', red(`Nie można utworzyć folderu /debug/${moduleName}/${functionName}/`), 'DebugSaveToFile');
        console.log(e);
    }
    if (dataType === 'JSON') {
        if (functionName === 'logChanges') {
            try {
                fs.appendFileSync(`./debug/${moduleName}/${functionName}/${fileName}.json`, JSON.stringify(data, null, 4) + '\n', 'utf8');
            } catch (e) {
                logger('verbose', red(`Nie można zapisać pliku ${fileName}.json`), 'DebugSaveToFile');
                console.log(e);
            }
            return;
        } else {
            try {
                fs.writeFileSync(`debug/${moduleName}/${functionName}/${fileName}.json`, JSON.stringify(data, null, 4), 'utf8');
            } catch (e) {
                logger('verbose', red(`Nie można zapisać pliku ${fileName}.json`), 'DebugSaveToFile');
                console.log(e);
            }
            return;
        }
    }
    if (dataType === 'ChińskiJSON') {
        try {
            fs.writeFileSync(`debug/${moduleName}/${functionName}/${fileName}.json`, JSON.stringify(removeCircularReferences(data), null, 4), 'utf8');
        } catch (e) {
            logger('verbose', red(`Nie można zapisać pliku ${fileName}.json`), 'DebugSaveToFile');
            console.log(e);
        }
        return
    }
    if (dataType === 'STACK') {
        try {
            fs.writeFileSync(`debug/${moduleName}/${functionName}/${fileName}.txt`, String(data.stack), 'utf8');
        } catch (e) {
            logger('verbose', red(`Nie można zapisać pliku ${fileName}.txt`), 'DebugSaveToFile');
            console.log(e);
        }
    }
    else {
        logger('verbose', red(`Nie można rozpoznać typu danych do zapisania! Dane pochodzą z funkcji ${functionName}`), 'DebugSaveToFile');
        console.log(data);
        process.exit(1);
    }
}

function removeCircularReferences(obj) {
    const seenObjects = new WeakSet();

    function cleanObject(input) {
        if (typeof input !== "object" || input === null) {
            return input; // Przeskocz prymitywy
        }

        if (seenObjects.has(input)) {
            return "[Circular]"; // Zamień cykliczne referencje
        }

        seenObjects.add(input);

        if (Array.isArray(input)) {
            return input.map(cleanObject); // Przetwórz tablice
        }

        const clean = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                try {
                    clean[key] = cleanObject(input[key]);
                } catch (error) {
                    clean[key] = `[Error: ${error.message}]`; // Obsługa błędów getterów
                }
            }
        }
        return clean;
    }

    return cleanObject(obj);
}

export { DebugSaveToFile, DebugStarter };