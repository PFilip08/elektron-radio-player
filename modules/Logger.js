import {bold, gray, magenta, cyan, bgWhiteBright, black, bgYellowBright, bgRedBright, whiteBright, bgCyanBright, bgGreenBright, bgBlackBright, blueBright} from 'colorette';

function logger(type, content, name) {
    let timestamp= new Date(Date.now()).toLocaleString('pl', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    let functionName = bgBlackBright(blueBright(name));
    switch (type) {
        case "log": return console.log(`${timestamp} ${bgWhiteBright(bold(gray(type.toUpperCase())))+` ${functionName}`} ${content} `);
        case "warn": return console.log(`${timestamp} ${bgYellowBright(black(type.toUpperCase()))+` ${functionName}`} ${content} `);
        case "error": return console.log(`${timestamp} ${bgRedBright(whiteBright(type.toUpperCase()))+` ${functionName}`} ${content} `);
        case "debug": return console.log(`${timestamp} ${magenta(type.toUpperCase())+` ${functionName}`} ${content} `);
        case "task": return console.log(`${timestamp} ${bgCyanBright(whiteBright(type.toUpperCase()))+` ${functionName}`} ${content}`);
        case "POST": return console.log(`${timestamp} ${cyan(type.toUpperCase())} ${content}`);
        case "ready": return console.log(`${timestamp} ${bgGreenBright(whiteBright(type.toUpperCase()))} ${content}`);
        default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
}

export { logger }