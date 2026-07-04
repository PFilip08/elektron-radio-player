import axios from 'axios';
import {Agent} from "node:https";
import {massSchedule} from "./TaskScheduler.js";
import {yellow} from 'colorette';
import {logger, findChanges, logChanges } from "./Logger.js";
import {DebugSaveToFile} from "./DebugMode.js";
const url = process.env.URI+'/api/timeTables';
let previousData = null;
let messageCounter = false;
let messageStartupBlocker = false;
let debugIntervalBlock = true;
let updateInterval, oldInterval;
let recoveryModeInterval = null;
let recoveryBlockTimeout = null;
let recoveryBlocked = false;
let recoveryModeCounter = 0;
let recoveryModeWindowStart = null;
const recoveryModeLimit = 3;
const recoveryModeWindow = 60000;
const recoveryModeTick = 1000;
const recoveryBlockDelay = 300000;

const api = axios.create({
    httpsAgent: new Agent({
        rejectUnauthorized: false,
    }),
    headers: {
        'User-Agent': 'Radio-Elektron_SAW_MONITORING v1.0'
    }
});

async function getApiData() {
    // redirect na devapi
    if (global.devAPIEnabled) {
        logger('log', 'DevAPI włączone - używanie local DevAPI', 'getApiData');
        try {
            const mockResponse = await api.get(`http://localhost:${process.env.PORT || 8080}/dev/api/timeTables`);
            return mockResponse.data.timeTable[0];
        } catch (e) {
            logger('error', 'DevAPI włączone, ale nie działa. Spadanie spowrotem na API filsza', 'getApiData');
        }
    }
if (!recoveryBlocked) {
    return await api.get(url)
        .then(res => {
            if (!messageCounter) {
                logger('verbose','Sprawdzanie czy blokada jest włączona...','getApiData');
                if (res.data.timeTable[0].isOn === false) {
                    logger('verbose',yellow('isOn jest przełączone na false!!!'),'getApiData');
                    if (!messageStartupBlocker) {
                        logger('verbose','Sprawdzanie czy blokada jest włączona przy starcie automatu...','getApiData');
                        messageStartupBlocker = true;
                        logger('warn','Włączono z blokadą!!!','getApiData');
                    }
                }
            }
            if (messageCounter) {
                logger('verbose',"Sprawdzanie czy response z serwera jest poprawny...",'getApiData');
                res.data.timeTable[0];
                logger('verbose','Wychodzenie z trybu recovery...','getApiData');
                logger('log','Przywrócono połączenie z internetem','getApiData');
                logger('log','Używanie danych z API','getApiData');
                stopRecoveryModeInterval();
                if (res.data.timeTable[0].currentPlaylistId === 7 && previousData?.static !== true) {
                    // to powstało tu dlatego, że po przywróceniu połączenia z internetem losowe playlisty zostawały, a nie z głosów (7)
                    logger('log', 'Wykryto nieaktualne zadania, wykonywanie funkcji massSchedule()','getApiData');
                    logger('verbose','Przywracanie zadań...','getApiData');
                    massSchedule();
                }
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
            logger('verbose','Wchodzenie w tryb recovery...','getApiData');
            logger('verbose',`Złapano błąd: ${error}`,'getApiData');
            if (global.debugmode === true) {
                DebugSaveToFile('ApiConnector','getApiData','recovery_reason',error);
                logger('verbose',`Pełen stackrace zrzucono do pliku recovery_reason.json!`,'getApiData');
            }
            if (!messageCounter) logger('warn','Tryb RECOVERY AKTYWNY!!!','getApiData');
            if (recoveryModeWindowStart === null) {
                startRecoveryModeInterval();
            }
            if (!(error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN' || error.code === 'ECONNREFUSED') && error.code === 'ENETUNREACH' && error.code !== undefined) {
                logger('verbose',yellow(`Wystąpił błąd który nie jest związany z brakiem połączenia z internetem: ${error.code}`),'getApiData');
                if (global.debugmode === true) {
                    DebugSaveToFile('ApiConnector','getApiData','recovery_counter_reason', error);
                    DebugSaveToFile('ApiConnector','getApiData','recovery_counter_code_reason', error.code);
                    logger('verbose',`Dane o triggerze countera zostały zrzuczone do plików!`,'getApiData');
                }
                recoveryModeCounter += 1;
            }
            let res = {"static":true,"isOn":true,"currentPlaylistId":1,"timeRules":{"rules":{"1":[{"end":"07:10","start":"07:07"},{"end":"08:00","start":"07:55"},{"end":"08:50","start":"08:45"},{"end":"09:45","start":"09:35"},{"end":"10:35","start":"10:30"},{"end":"11:40","start":"11:20"},{"end":"12:30","start":"12:25"},{"end":"13:20","start":"13:15"},{"end":"14:10","start":"14:05"},{"end":"15:00","start":"14:55"},{"end":"15:50","start":"15:45"}]},"applyRule":{"Fri":1,"Mon":1,"Sat":0,"Sun":0,"Thu":1,"Tue":1,"Wed":1}}};
            if (previousData !== null) {
                res = previousData;
                logger('verbose','Używanie danych pobranych poprzednio z API ze zmiennej previousData!!!','getApiData');
                if (global.debugmode === true) {
                    DebugSaveToFile('ApiConnector','getApiData','previousData',res);
                    logger('verbose',`Dane z previousData zostały zrzucone`,'getApiData');
                }
                if (!messageCounter) {
                    // massSchedule() powstał tu dlatego że zadania po wejściu w tryb recovery nie były ponownie planowane co powodowało że kod w linijkach 130 - 136 w pliku TaskScheduler.js nie był wykonywany
                    massSchedule();
                    logger('warn','Używanie danych pobranych poprzednio z API!','getApiData');
                }
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
    } else {
        logger('error',yellow('Funkcja GetApiData jest zablokowana!'),'getApiData');
        return previousData;
    }
}

function clearGetApiDataBlock() {
    if (!recoveryBlocked) {
        logger('verbose','Funkcja GetApiData nie jest zablokowana, wychodzenie z funkcji...','clearGetApiDataBlock');
        return false;
    }
    recoveryBlocked = false;
    recoveryBlockTimeout = null;
    logger('log','Zdjęto blokadę z GetApiData','clearGetApiDataBlock');
    return true;
}

function blockGetApiData() {
    logger('verbose','Blokowanie funkcji GetApiData...','blockGetApiData');
    recoveryBlocked = true;
    stopRecoveryModeInterval();
    if (recoveryBlockTimeout) {
        clearTimeout(recoveryBlockTimeout);
        logger('debug','Wykryto aktywne odroczenie, restart timera blokady','blockGetApiData');
    }
    recoveryBlockTimeout = setTimeout(() => {
        clearGetApiDataBlock()
        logger('log','Zdjęto blokadę z GetApiData po 5 minutach','blockGetApiData');
    }, recoveryBlockDelay);
    logger('warn','Funkcja GetApiData została odroczona na 5 minut','blockGetApiData');
}

async function monitorRecoveryMode() {
    if (recoveryModeCounter > recoveryModeLimit) {
        logger('warn',yellow(`Przekroczono limit uruchomień trybu recovery: ${recoveryModeCounter}/${recoveryModeLimit} w oknie ${recoveryModeWindow / 1000} sekund`),'monitorRecoveryMode');
        logger('warn',yellow('Zatrzymywanie funkcji checkUpdate i odraczanie funkcji ApiConnector...'),'monitorRecoveryMode');
        blockGetApiData();
        logger('warn',yellow('O jezus maria zdarzyła się awaria!'),'monitorRecoveryMode');
        recoveryModeCounter = 0;
        recoveryModeWindowStart = null;
        return;
    }
    const now = Date.now();
    if (now - recoveryModeWindowStart >= recoveryModeWindow) {
        logger('verbose',`W oknie ${recoveryModeWindow / 1000} sekund nie przekroczono limitu, licznik wyzerowany`,`monitorRecoveryMode`);
        recoveryModeCounter = 0;
        recoveryModeWindowStart = now;
    }
}

async function startRecoveryModeInterval() {
    if (recoveryModeInterval) {
        logger('debug','Interwał monitorowania recoveryModeCounter już działa','startRecoveryModeInterval');
        return;
    }
    recoveryModeCounter = 0;
    recoveryModeWindowStart = Date.now();
    logger('debug',`Uruchamianie monitorowania recoveryModeCounter co ${recoveryModeTick / 1000} sekund (okno ${recoveryModeWindow / 1000} sekund)`,'startRecoveryModeInterval');
    recoveryModeInterval = setInterval(() => {
        monitorRecoveryMode().catch((error) => {
            logger('debug',`Błąd monitorowania recovery: ${error}`,'startRecoveryModeInterval');
        });
    }, recoveryModeTick);
}

async function stopRecoveryModeInterval() {
    if (!recoveryModeInterval) {
        logger('debug','Interwał monitorowania recoveryModeCounter już jest zatrzymany','stopRecoveryModeInterval');
        return;
    }
    clearInterval(recoveryModeInterval);
    recoveryModeInterval = null;
    recoveryModeCounter = 0;
    recoveryModeWindowStart = null;
    logger('debug','Zatrzymano monitorowanie recoveryModeCounter','stopRecoveryModeInterval');
}
let checkUpdateRunning = false;
async function checkUpdate() {
    try {
        messageStartupBlocker = true;
        if (checkUpdateRunning === true) {
            logger('verbose','Funkcja checkUpdate jest już uruchomiona, wychodzenie z funkcji...','checkUpdate');
            return;
        }
        checkUpdateRunning = true;
        const currentData = await getApiData();
        logger('verbose','Sprawdzanie czy dane są statyczne...','checkUpdate');
        if (currentData.static) {
            logger('verbose','Dane są statyczne, nie można ich porównać','checkUpdate');
            logger('verbose','Zwrócono dane statyczne','checkUpdate');
            checkUpdateRunning = false;
            return;
        }
        logger('verbose','Sprawdzanie czy dane są różne...','checkUpdate');
        if (previousData && JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            logger('verbose','Dane różnią się','checkUpdate');
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
        checkUpdateRunning = false;
        previousData = currentData;
    } catch (error) {
        logger('error', '--------Check Update--------','checkUpdate');
        logger('error', `Błąd podczas odpytywania API: ${error}`,'checkUpdate');
        if (global.debugmode === true) {
            DebugSaveToFile('ApiConnector','checkUpdate','catched_error',error);
            logger('verbose',`Stacktrace zrzucono do pliku catched_error.txt`,'checkUpdate');
        }
        logger('error', '--------Check Update--------','checkUpdate');
        checkUpdateRunning = false;
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
        setInterval(() => {
            scheduleUpdate();
        }, 1000);
        debugIntervalBlock = false;
    }
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const time = date.getHours();
    if (time>=7 && time<=15) interval=intervalOnAir; else interval=intervalOffAir;
    if (day === 6 || day === 0) interval=intervalWeekend;
    if (month === 7 || month === 8) interval=intervalVacation;
    if (oldInterval === interval) {
        if (oldInterval===undefined) startInterval(interval);
    } else {
        if (interval===intervalOnAir) logger('log', 'Praca radiowęzła, krótki update', 'scheduleUpdate');
        else if (interval===intervalVacation) logger('log', 'Wakacje, długi update', 'scheduleUpdate');
        else if (interval===intervalWeekend) logger('log', 'Weekend, długi update', 'scheduleUpdate');
        else logger('log', 'Po pracy radiowęzła, zwykły update', 'scheduleUpdate');
        logger('log', 'Usuwanie starego intervala i startowanie nowego intervalu', 'scheduleUpdate');
        clearInterval(updateInterval);
        startInterval(interval);
        oldInterval = interval;
    }
}

export { getApiData, checkUpdate, scheduleUpdate, clearGetApiDataBlock, messageCounter, previousData };