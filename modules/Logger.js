import {bold, gray, magenta, cyan, bgWhiteBright, black, bgYellowBright, bgRedBright, whiteBright, bgCyanBright, bgGreenBright, bgBlackBright, blueBright} from 'colorette';
import colors from 'colors';
import fs from "fs";
import { DebugSaveToFile } from './DebugMode.js';

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
    if (type==='verbose' && process.env.VERBOSE === 'false') return;
    switch (type) {
        case "log": return console.log(`${timestamp} ${bgWhiteBright(bold(gray(type.toUpperCase())))+` ${functionName}`} ${content} `);
        case "warn": return console.log(`${timestamp} ${bgYellowBright(black(type.toUpperCase()))+` ${functionName}`} ${content} `);
        case "error": return console.log(`${timestamp} ${bgRedBright(whiteBright(type.toUpperCase()))+` ${functionName}`} ${content} `);
        case "debug": return console.log(`${timestamp} ${magenta(type.toUpperCase())+` ${functionName}`} ${content} `);
        case "verbose": return console.log(`${timestamp} ${magenta(type.toUpperCase())+` ${functionName}`} ${content} `);
        case "task": return console.log(`${timestamp} ${bgCyanBright(whiteBright(type.toUpperCase()))+` ${functionName}`} ${content}`);
        case "POST": return console.log(`${timestamp} ${cyan(type.toUpperCase())} ${content}`);
        case "ready": return console.log(`${timestamp} ${bgGreenBright(whiteBright(type.toUpperCase()))} ${content}`);
        default: throw new TypeError("Logger type must be either warn, debug, verbose, log, ready, POST, task or error.");
    }
}

function findChanges(obj1, obj2, path = '') {
    logger('verbose', `Porównywanie obiektów ${path}`, 'findChanges');
    const changes = [];
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    logger('verbose', `Znaleziono klucze: ${Array.from(keys).join(', ')}`, 'findChanges');
    keys.forEach(key => {
      const fullPath = path ? `${path}.${key}` : key;
      logger('verbose', `Sprawdzanie klucza: ${fullPath}`, 'findChanges');
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        logger('verbose', `Znaleziono różnicę w kluczu: ${fullPath}`, 'findChanges');
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && obj1[key] && obj2[key]) {
          logger('verbose', `W ${fullPath} wykryto jakąś zmianę. Dokonywanie dokładnego sprawdzenia...`, 'findChanges');
          changes.push(...findChanges(obj1[key], obj2[key], fullPath));
        } else {
          logger('verbose', `W ${fullPath} wykryto zmianę. Zapisywanie...`, 'findChanges');
          changes.push({ key: fullPath, oldValue: obj1[key], newValue: obj2[key] });
        }
      }
    });
    logger('verbose', `Obiekty które są różne zostały zrzucone do debug/`, 'logChanges');
    logger('verbose', `Zakończono porównywanie obiektów ${JSON.stringify(changes)}`, 'findChanges');
    return changes;
  }
  
function logChanges(changes) {
    let counter = 0;
    logger('verbose', `Rozpoczęto logowanie zmian`, 'logChanges');
    changes.forEach(change => {
      counter++;
      const { key, oldValue, newValue } = change;
      let message = `Zmiana w ${key}: `;
      
      if (key.includes('start') || key.includes('end')) {
        message += `Godzina została zmieniona z ${oldValue} na ${newValue}`;
      } 
      else if (key.includes('playlist')) {
        if (newValue === undefined) {
          message += `Klucz "playlist" został usunięty`;
        } else if (oldValue === undefined) {
          message += `Klucz "playlist" został dodany, wartość nowego klucza wynosi: ${newValue}`;
        } else {
          message += `Wartość klucza "playlist" została zmieniona z ${oldValue} na ${newValue}`;
        }
      } 
      else if (key.includes('OnDemand')) {
        if (newValue === undefined) {
            message += `Klucz "OnDemand" został usunięty`;
        } else if (oldValue === undefined) {
            message += `Klucz "OnDemand" został dodany, wartość nowego klucza wynosi: ${newValue}\n`;
        } else {
            message += `Wartość klucza "OnDemand" została zmieniona z ${oldValue} na ${newValue}\n`;
        }
      } 
      else if (key.includes('applyRule')) {
        let day = key.split('.').pop();
        switch (day) {
            case 'Mon': day = 'Poniedziałek'; break;
            case 'Tue': day = 'Wtorek'; break;
            case 'Wed': day = 'Środa'; break;
            case 'Thu': day = 'Czwartek'; break;
            case 'Fri': day = 'Piątek'; break;
            case 'Sat': day = 'Sobota'; break;
            case 'Sun': day = 'Niedziela'; break;
            default: day = 'Nieznany dzień'; break;
        }
        message += `Zasada dla dnia ${day} została zmieniona z ${oldValue} na ${newValue}`;
      } 
      else if (key.startsWith('timeRules.rules') && Array.isArray(newValue)) {
        message += `Zasada o numerze ${key.split('.').pop()} została dodana i wprowadza takie zasady dla ${newValue.length} przerw\n`;
        newValue.forEach((rule, index) => {
            message += ` - Przerwa ${index + 1}: `;
            Object.entries(rule).forEach(([ruleKey, ruleValue]) => {
              message += `${ruleKey}: ${ruleValue}, `;
            });
            message += '\n';
          });
      } 
      else if (key.startsWith('timeRules.rules') && Array.isArray(oldValue)) {
        message += `Zasada o numerze ${key.split('.').pop()} została usunięta`;
      } 
      else if (key.includes('currentPlaylistId')) {
        if (oldValue === undefined || newValue === undefined) {
            message += ``;
        } else if (oldValue !== newValue || newValue !== oldValue) {
            message += `Playlista główna została zmieniona z ${oldValue} na ${newValue}`;
        }
      }
      else {
        message += `Wartość została zmieniona z ${oldValue} na ${newValue}`;
      }
      if (!key.includes('id') && !key.includes('created_at') === true) {
        if (oldValue !== undefined || newValue !== undefined) {
            logger('debug', colors.yellow(message), 'logChanges');
        }
      }
    });
    if (global.debugmode === true) {
      DebugSaveToFile('Logger', 'logChanges', 'changes', changes);
    }
    logger('verbose', `Liczba zmian wynosi: ${counter}`, 'logChanges');
    logger('verbose', `Zakończono logowanie zmian`, 'logChanges');
  }
  

export { logger, findChanges, logChanges }