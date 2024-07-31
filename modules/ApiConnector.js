import axios from 'axios';
import {Agent} from "node:https";
import {massSchedule} from "./TaskScheduler.js";
import {logger, findChanges, logChanges } from "./Logger.js";
let url = 'https://radio-elektron.vercel.app/api/timeTables';
let previousData = null;
let messageCounter = false;
let messageStartupBlocker = false;
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
                if (res.data.timeTable[0].isOn === false) {
                    if (!messageStartupBlocker) {
                        messageStartupBlocker = true;
                        logger('warn','Włączono z blokadą!!!','getApiData');
                    }
                }
            }
            if (messageCounter) {
                logger('log','Przywrócono połączenie z internetem','getApiData');
                logger('log','Używanie danych z API','getApiData');
                messageCounter = false;
            }
            if (res.data.timeTable[0].isOn === false) {
                return {isOn: false};
            }
            return res.data.timeTable[0];
        })
        .catch(()=>{
            // console.log(err);
            if (!messageCounter) logger('warn','Tryb RECOVERY AKTYWNY!!!','getApiData');
            // let res =
            let res = {"static":true,"isOn":true,"currentPlaylistId":1,"timeRules":{"rules":{"1":[{"end":"07:10","start":"07:07"},{"end":"08:00","start":"07:55"},{"end":"08:50","start":"08:45"},{"end":"09:45","start":"09:35"},{"end":"10:35","start":"10:30"},{"end":"11:40","start":"11:20"},{"end":"12:30","start":"12:25"},{"end":"13:20","start":"13:15"},{"end":"14:10","start":"14:05"},{"end":"15:00","start":"14:55"},{"end":"15:50","start":"15:45"}]},"applyRule":{"Fri":1,"Mon":1,"Sat":0,"Sun":0,"Thu":1,"Tue":1,"Wed":1}}};
            if (previousData !== null) {
                res = previousData;
                if (!messageCounter) logger('warn','Używanie danych pobranych poprzednio z API!','getApiData');
            }
            if (res.static) {
                messageStartupBlocker = true;
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
        if (currentData.static) {
            return;
        }

        if (previousData && JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            massSchedule();
            logger('log', '--------Check Update--------','checkUpdate');
            logger('log', 'Pobrano dane z API','checkUpdate');
            logger('log', '--------Check Update--------','checkUpdate');
            const changes = findChanges(previousData, currentData);
            logChanges(changes);
        }

        previousData = currentData;
    } catch (error) {
        logger('error', '--------Check Update--------','checkUpdate');
        logger('error', `Błąd podczas odpytywania API: ${error}`,'checkUpdate');
        logger('error', '--------Check Update--------','checkUpdate');
    }
}

function startInterval(interval) {
    updateInterval = setInterval(() => {
        checkUpdate().catch(error => {
            console.log(error);
        });
        // console.log('dupa', interval);
    }, interval);
}

function scheduleUpdate() {
    let interval;
    const intervalOnAir = 3000;
    const intervalOffAir = 10000;
    const intervalWeekend = 30000;
    const intervalVacation = 60000;
    const date = new Date();
    const day = date.toLocaleDateString('pl',{weekday:'long'});
    const month = date.toLocaleDateString('pl',{month:'long'});
    const time = date.getHours();
    if (time>=7 && time<=15) interval=intervalOnAir; else interval=intervalOffAir;
    if (month === 'lipiec' || month === 'sierpień') interval=intervalVacation;
    if (oldInterval === interval) {
        if (oldInterval===undefined) startInterval(interval);
    } else {
        if (day === 'sobota' || day === 'niedziela') interval=intervalWeekend;
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