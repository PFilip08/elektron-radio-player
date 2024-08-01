import schedule from "node-schedule";
import {killPlayer, playOnDemand, playPlaylist} from "./MusicPlayer.js";
import {getApiData} from "./ApiConnector.js";
import {autoRemoveFiles, downloader, getTrackInfo} from "./MusicDownloader.js";
import {logger} from "./Logger.js";
import {sterylizator} from "./Other.js";
import colors from 'colors';

function taskNumber() {
    let n = 0;
    logger('verbose', 'Sprawdzanie liczby zrobionych zadań...', 'taskNumber');
    for (let i in schedule.scheduledJobs) {
        n = n+1;
    }
    return logger('task', `Liczba zadań: ${n}`, 'taskNumber');
}

function scheduleMusicTask(time, id) {
    logger('verbose', `Zadanie zaplanowane na ${time}`, 'scheduleMusicTask');
    logger('verbose', `ID playlisty: ${id.id}`, 'scheduleMusicTask');
    schedule.scheduleJob(time, function () {
        logger('log', 'Granie playlisty nr: '+id.id,'scheduleMusicTask')
        playPlaylist(id.id);
    });
}

function scheduleKillTask(time) {
    logger('verbose', `Zadanie ubicia Pjeyera zaplanowane na ${time}`, 'scheduleKillTask');
    schedule.scheduleJob(time, killPlayer);
}

async function checkScheduleTime(timeEnd, timeStart, rule, breakNumber) {
    logger('verbose', `Sprawdzanie zasady ${rule} i przerwy ${breakNumber}`, 'checkScheduleTime');
    let timeEndArray = timeEnd.split(':');
    let timeStartArray = timeStart.split(':');
    let breakNumberInt = parseInt(breakNumber, 10) + 1;
    breakNumber = (breakNumber + 1);
    if (timeEndArray[0] < timeStartArray[0]) {
        logger('verbose', colors.yellow('WYKRYTO RÓŻNICĘ W GODZINIE!!!'), 'checkScheduleTime');
        logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest wcześniejszy niż czas rozpoczęcia (${timeStart}), różnica wynosi ${(timeStartArray[0] - timeEndArray[0])} godziny.`, 'checkScheduleTime')
        return false;
    }
    if (timeEndArray[0] === timeStartArray[0]) {
        if (timeEndArray[1] < timeStartArray[1]) {
            logger('verbose', colors.yellow('WYKRYTO RÓŻNICĘ W MINUTACH!!!'), 'checkScheduleTime');
            logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest wcześniejszy niż czas rozpoczęcia (${timeStart} aka "start" w JSONie), różnica wynosi ${(timeStartArray[1] - timeEndArray[1])} minut.`, 'checkScheduleTime')
            return false;
        }
    }
    logger('verbose', `Zasada ${rule} i przerwa ${breakNumberInt} jest poprawna`, 'checkScheduleTime');
    return true;
}

async function massSchedule() {
    logger('verbose', 'Rozpoczęto masowe planowanie zadań...', 'massSchedule');
    logger('verbose', 'Zatrzymywanie wszystkich zadań', 'massSchedule');
    await schedule.gracefulShutdown();
    logger('verbose', 'Planowanie zadania automatycznego usuwania plików...', 'massSchedule');
    schedule.scheduleJob('0 5 * * 1-5', autoRemoveFiles);
    logger('verbose', 'Pobieranie danych przy użyciu getApiData', 'massSchedule');
    const data = await getApiData();
    logger('verbose', 'Sprawdzanie czy isOn jest ustawione na false', 'massSchedule');
    if (!data.isOn) {
        logger('verbose', 'Zwrócono {isOn: false}', 'massSchedule');
        taskNumber();
        return logger('error','Brakuje danych!!!', 'massSchedule')
    }
    const time = data.timeRules.rules;
    const day = data.timeRules.applyRule;
    const currentPlaylist = data.currentPlaylistId;

    const dayMapping = {
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
        Sun: 7
    };

    const mappedDays = {};
    logger('verbose', 'Mapowanie dni...', 'massSchedule');
    for (const i in day) {
        if (day.hasOwnProperty(i)) {
            const mappedDay = dayMapping[i];
            mappedDays[mappedDay] = day[i];
        }
    }
    logger('verbose','Uruchamianie pętli do ustawiania zadań...','massSchedule');
    const checkedSchedules = new Set();
    for (let l in mappedDays) {
        if (mappedDays[l] === 0) continue;
        for (let i in time[mappedDays[l]]) {
            let id = currentPlaylist;
            if (time[mappedDays[l]][i].playlist !== undefined) {
                logger('verbose', `Znaleziono playlistę!`, 'massSchedule');
                id = time[mappedDays[l]][i].playlist;
            }
            if (time[mappedDays[l]][i].playlist === 0) {
                logger('verbose', 'Znaleziono playlistę 0!!! Kontynuowanie wykonywania pętli...', 'massSchedule');
                // console.log('dupa')
                continue;
            }
            if (time[mappedDays[l]][i].OnDemand !== undefined) {
                logger('verbose', 'Znaleziono OnDemand!!!', 'massSchedule');
                logger('log', 'ONDEMAND OMAJGAH!!!1!111!!1!1!!!', 'massSchedule');
                await downloader(time[mappedDays[l]][i].OnDemand);
                const trackInfo = await getTrackInfo(time[mappedDays[l]][i].OnDemand);
                schedule.scheduleJob(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, function () {
                    playOnDemand(sterylizator(trackInfo.name));
                    logger('log', `On Demand: ${trackInfo.name+ ' by '+ trackInfo.artists.join(' ')}`,'massSchedule');
                });
                scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
                continue;
            }
            const scheduleKey = `${time[mappedDays[l]][i].start}-${time[mappedDays[l]][i].end}`;

            if (!checkedSchedules.has(scheduleKey)) {
                logger('verbose', `Sprawdzanie zapisu czasu ${scheduleKey}`, 'massSchedule');
                checkedSchedules.add(scheduleKey);
                const isValidTime = await checkScheduleTime(time[mappedDays[l]][i].end, time[mappedDays[l]][i].start, mappedDays[l], i);
                if (!isValidTime) {
                    logger('error', 'Odrzucono nieprawidłowy zapis czasu!!!', 'massSchedule');
                    continue;
                }
            }
            // checkScheduleTime(time[mappedDays[l]][i].end,time[mappedDays[l]][i].start)
            logger('verbose', 'Planowanie zadań...', 'massSchedule');
            scheduleMusicTask(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, {id});
            scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
        }
    }
    taskNumber();
}

export { scheduleMusicTask, scheduleKillTask, massSchedule };