import axios from 'axios';
import {Agent} from "node:https";
import {massSchedule} from "./TaskScheduler.js";
import {logger, findChanges, logChanges } from "./Logger.js";
import colors from 'colors';
import {DebugSaveToFile} from "./DebugMode.js";
let url = 'https://radio-elektron.vercel.app/api/timeTables';
let previousData = null;
let messageCounter = false;
let messageStartupBlocker = false;
let debugIntervalBlock = true;
let updateInterval, oldInterval;

const api = axios.create({
    httpsAgent: new Agent({
        rejectUnauthorized: false,
    }),
    headers: {
        'User-Agent': 'Radio-Elektron_SAW_MONITORING v1.0'
    }
});

// async function getApiData() {
//     api.get(url)
//         .then(res => console.log(res.data.timeTable[0].timeRules.rules))
//         .catch(err=>console.log(err));
// }

async function getApiData() {
    return await api.get(url)
        .then(res => {
            if (!messageCounter) {
                logger('verbose','Sprawdzanie czy blokada jest włączona...','getApiData');
                if (res.data.timeTable[0].isOn === false) {
                    logger('verbose',colors.yellow('isOn jest przełączone na false!!!'),'getApiData');
                    if (!messageStartupBlocker) {
                        logger('verbose','Sprawdzanie czy blokada jest włączona przy starcie automatu...','getApiData');
                        messageStartupBlocker = true;
                        logger('warn','Włączono z blokadą!!!','getApiData');
                    }
                }
            }
            if (messageCounter) {
                logger('verbose','Wychodzenie z trybu recovery...','getApiData');
                logger('log','Przywrócono połączenie z internetem','getApiData');
                logger('log','Używanie danych z API','getApiData');
                messageCounter = false;
            }
            if (res.data.timeTable[0].isOn === false) {
                logger('verbose','Zwrócono {isOn: false}','getApiData');
                return {isOn: false};
            }
            if (global.debugmode === true) {
                DebugSaveToFile('ApiConnector','getApiData','response',res.data.timeTable[0]);
                logger('verbose',`Response z serwera został zrzucony!`,'getApiData');
            }
            return res.data.timeTable[0];
        })
        .catch((error)=>{
            // console.log(err);
            logger('verbose','Wchodzenie w tryb recovery...','getApiData');
            logger('verbose',`Złapano błąd: ${error}`,'getApiData');
            if (global.debugmode === true) {
                DebugSaveToFile('ApiConnector','getApiData','recovery_reason',error);
                logger('verbose',`Pełen stackrace zrzucono do pliku recovery_reason.json!`,'getApiData');
            }
            if (!messageCounter) logger('warn','Tryb RECOVERY AKTYWNY!!!','getApiData');
            // let res =
            let res = {"static":true,"isOn":true,"currentPlaylistId":1,"timeRules":{"rules":{"1":[{"end":"07:10","start":"07:07"},{"end":"08:00","start":"07:55"},{"end":"08:50","start":"08:45"},{"end":"09:45","start":"09:35"},{"end":"10:35","start":"10:30"},{"end":"11:40","start":"11:20"},{"end":"12:30","start":"12:25"},{"end":"13:20","start":"13:15"},{"end":"14:10","start":"14:05"},{"end":"15:00","start":"14:55"},{"end":"15:50","start":"15:45"}]},"applyRule":{"Fri":1,"Mon":1,"Sat":0,"Sun":0,"Thu":1,"Tue":1,"Wed":1}}};
            if (previousData !== null) {
                res = previousData;
                logger('verbose','Używanie danych pobranych poprzednio z API ze zmiennej previousData!!!','getApiData');
                if (global.debugmode === true) {
                    DebugSaveToFile('ApiConnector','getApiData','previousData',res);
                    logger('verbose',`Dane z previousData zostały zrzucone`,'getApiData');
                }
                if (!messageCounter) logger('warn','Używanie danych pobranych poprzednio z API!','getApiData');
            }
            if (res.static) {
                messageStartupBlocker = true;
                logger('verbose','Używanie danych które są zapisane lokalnie w skrypcie!!!','getApiData');
                previousData=res;
                if (global.debugmode === true) {
                    DebugSaveToFile('ApiConnector','getApiData','static_data',res);
                    logger('verbose','Dane zapisane lokalnie zostały zrzucone','getApiData');
                }
                if (!messageCounter) logger('warn','Używanie danych statycznych!.','getApiData');
            }
            if (!messageCounter) messageCounter = true;
            return res;
        });
}

async function checkUpdate() {
    try {
        messageStartupBlocker = true;
        const currentData = await getApiData();
        logger('verbose','Sprawdzanie czy dane są statyczne...','checkUpdate');
        if (currentData.static) {
            logger('verbose','Dane są statyczne, nie można ich porównać','checkUpdate');
            logger('verbose','Zwrócono dane statyczne','checkUpdate');
            return;
        }
        logger('verbose','Sprawdzanie czy dane są różne...','checkUpdate');
        if (previousData && JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            logger('verbose','Dane róźnią się','checkUpdate');
            logger('verbose','Planowanie zadań...','checkUpdate');
            logger('verbose','Czekanie na wykonanie funkcji massSchedule...','checkUpdate');
            await massSchedule();
            logger('log', '--------Check Update--------','checkUpdate');
            logger('log', 'Pobrano dane z API','checkUpdate');
            logger('log', '--------Check Update--------','checkUpdate');
            logger('verbose','Przekazywanie danych do funkcji findChanges...','checkUpdate');
            const changes = findChanges(previousData, currentData);
            logger('verbose','Przekazywanie danych do funkcji logChanges...','checkUpdate');
            logChanges(changes);
        }
        logger('verbose','Zapisywanie danych do zmiennej previousData...','checkUpdate');
        previousData = currentData;
    } catch (error) {
        logger('error', '--------Check Update--------','checkUpdate');
        logger('error', `Błąd podczas odpytywania API: ${error}`,'checkUpdate');
        if (global.debugmode === true) {
            DebugSaveToFile('ApiConnector','checkUpdate','catched_error',error);
            logger('verbose',`Stacktrace zrzucono do pliku catched_error.txt`,'checkUpdate');
        }
        logger('error', '--------Check Update--------','checkUpdate');
    }
}

function startInterval(interval) {
    updateInterval = setInterval(() => {
        checkUpdate().catch(error => {
            logger('verbose','Wystąpił błąd podczas wykonywania funkcji checkUpdate','startInterval');
            logger('verbose',`Błąd: ${error}`,'startInterval');
            if (global.debugmode === true) {
                DebugSaveToFile('ApiConnector','startInterval','catched_error',error);
            }
            logger('verbose','Zrzucono stackrace do pliku catched_error.txt','startInterval');
            console.log(error);
        });
    }, interval);
}

function scheduleUpdate() {
    let interval;
    const intervalOnAir = 3000;
    const intervalOffAir = 10000;
    const intervalWeekend = 30000;
    const intervalVacation = 60000;
    if (debugIntervalBlock) {
        logger('verbose', 'Sprawdzanie ustawień interwału...', 'scheduleUpdate');
        logger('verbose',` - Praca radiowęzła: ${intervalOnAir / 1000} sekund`,'scheduleUpdate');
        logger('verbose',` - Po pracy radiowęzła: ${intervalOffAir / 1000} sekund`,'scheduleUpdate');
        logger('verbose',` - Weekend: ${intervalWeekend / 1000} sekund`,'scheduleUpdate');
        logger('verbose',` - Wakacje: ${intervalVacation / 1000} sekund`,'scheduleUpdate');
        debugIntervalBlock = false;
    }
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const time = date.getHours();
    if (time>=7 && time<=15) interval=intervalOnAir; else interval=intervalOffAir;
    if (day === 6 || day === 7) interval=intervalWeekend;
    if (month === 7 || month === 8) interval=intervalVacation;
    if (oldInterval === interval) {
        if (oldInterval===undefined) startInterval(interval);
    } else {
        if (interval===intervalOnAir) logger('log', 'Praca radiowęzła, krótki update', 'scheduleUpdate');
        else if (interval===intervalVacation) logger('log', 'Wakacje, długi update', 'scheduleUpdate');
        else logger('log', 'Po pracy radiowęzła, zwykły update', 'scheduleUpdate');
        logger('log', 'Usuwanie starego intervala i startowanie nowego intervalu', 'scheduleUpdate');
        clearInterval(updateInterval);
        startInterval(interval);
        oldInterval = interval;
    }
}

export { getApiData, checkUpdate, scheduleUpdate };