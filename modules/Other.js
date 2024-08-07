import { DebugSaveToFile } from "./DebugMode.js";
import { logger } from "./Logger.js";
import path from 'path';
import colors from 'colors';

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
        logger('verbose', `Zwrócono wynik sterylizacji do debug/`);
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
    let rootDirectory = path.resolve(process.cwd(), 'mp3');
    var filename = path.join(rootDirectory, filepath);
    if (filename.indexOf(rootDirectory) !== 0) {
        logger('warn', colors.yellow(`Próba wyjścia poza katalog główny mp3!!!`), 'pathSecurityChecker');
        return 'ROOT_EXIT_ATTEMPT';
    }
    logger('verbose', 'Sprawdzanie czy ścieżka nie zawiera dwukropków', 'pathSecurityChecker');
    if (!/^[a-z0-9]+$/.test(filepath)) {
        logger('warn', colors.yellow(`Próba wyjścia poza katalog główny przy użyciu dwukropków!!!`), 'pathSecurityChecker');
        return 'ESCAPE_PATH_ATTEMPT';
    }
    return 'NONE'
}

export { sterylizator, pathSecurityChecker };