import { DebugSaveToFile } from "./DebugMode.js";
import { logger } from "./Logger.js";


function sterylizator(input) {
    logger('verbose', `Sterylizacja tekstu: ${input}`, 'sterylizator');
    if (global.debugmode === true) {
        DebugSaveToFile('Other', 'sterylizator', 'source', input);
        logger('verbose', 'Tekst źródłowy zapisany do debug/', 'sterylizator');
    }
    let sterilised = input.split(' ').join('_').replace(/[^a-zA-Z_0-9-\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g, "");
    if (global.debugmode === true) {
        DebugSaveToFile('Other', 'sterylizator', 'result', sterilised);
        logger('verbose', `Zwrócono wynik sterylizacji do debug/`)
    }
    return sterilised;
}

export {sterylizator};