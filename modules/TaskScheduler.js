import schedule from "node-schedule";
import {killPlayer, playOnDemand, playPlaylist} from "./MusicPlayer.js";
import {getApiData} from "./ApiConnector.js";
import {autoRemoveFiles, downloader, getTrackInfo} from "./MusicDownloader.js";
import {logger} from "./Logger.js";

function taskNumber() {
    let n = 0
    for (let i in schedule.scheduledJobs) {
        n = n+1
    }
    // return console.log('[Funkcja taskNumber] Liczba zadań:', n);
    return logger('task', `Liczba zadań: ${n}`, 'taskNumber');
}

function scheduleMusicTask(time, id) {
    schedule.scheduleJob(time, function () {
        logger('log', 'Granie playlisty nr: '+id.id,'scheduleMusicTask')
        playPlaylist(id.id);
    });
}

function scheduleKillTask(time) {
    schedule.scheduleJob(time, killPlayer);
}

async function checkscheduleTime(timeEnd, timeStart, rule, breakNumber) {
    let timeEndArray = timeEnd.split(':');
    let timeStartArray = timeStart.split(':');
    let breakNumberInt = parseInt(breakNumber, 10) + 1;
    //console.log(timeEndArray)
    //console.log(timeStartArray)
    breakNumber = (breakNumber + 1);
    if (timeEndArray[0] < timeStartArray[0]) {
        //console.log(timeEndArray[0] - timeStartArray[0])
        //console.log('End time is smaller than start time!')
        logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd})("end" w jsonie) jest wcześniejszy niż czas rozpoczęcia (${timeStart}), różnica wynosi ${(timeStartArray[0] - timeEndArray[0])} godziny.`, 'checkscheduleTime')
        return false;
    }
    if (timeEndArray[0] === timeStartArray[0]) {
        if (timeEndArray[1] < timeStartArray[1]) {
            //console.log(timeEndArray[1] - timeStartArray[1])
            logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd})("end" w jsonie) jest wcześniejszy niż czas rozpoczęcia (${timeStart})("start" w jsonie), różnica wynosi ${(timeStartArray[1] - timeEndArray[1])} minut.`, 'checkscheduleTime')
            return false;
        }
    }
    //console.log('true')
    return true;
}

async function massSchedule() {
    await schedule.gracefulShutdown();
    schedule.scheduleJob('0 5 * * 1-5', autoRemoveFiles);
    const data = await getApiData();
    if (!data.isOn) {
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
    for (const i in day) {
        if (day.hasOwnProperty(i)) {
            const mappedDay = dayMapping[i];
            mappedDays[mappedDay] = day[i];
        }
    }
    const checkedSchedules = new Set();
    for (let l in mappedDays) {
        if (mappedDays[l] === 0) continue;
        for (let i in time[mappedDays[l]]) {
            // console.log(time[1][i])
            // console.log(data[1][i].start.split(':').reverse().join(' '));
            // console.log(data[1][i].end.split(':').reverse().join(' '));
            let id = currentPlaylist;
            // console.log(time[mappedDays[l]][i].playlist)
            if (time[mappedDays[l]][i].playlist !== undefined) {
                id = time[mappedDays[l]][i].playlist;
            }
            if (time[mappedDays[l]][i].playlist === 0) {
                // console.log('dupa')
                continue;
            }
            if (time[mappedDays[l]][i].OnDemand !== undefined) {
                logger('log', 'ONDEMAND OMAJGAH!!!1!111!!1!1!!!', 'massSchedule');
                await downloader(time[mappedDays[l]][i].OnDemand);
                const trackInfo = await getTrackInfo(time[mappedDays[l]][i].OnDemand);
                // console.log(trackInfo)
                schedule.scheduleJob(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, function () {
                    playOnDemand(trackInfo.name.split(' ').join('_').replace(/[^a-zA-Z_]/g, ""));
                    logger('log', `On Demand: ${trackInfo.name+ ' by '+ trackInfo.artists.join(' ')}`,'massSchedule');
                });
                scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
                continue;
            }
            const scheduleKey = `${time[mappedDays[l]][i].start}-${time[mappedDays[l]][i].end}`;

            if (!checkedSchedules.has(scheduleKey)) {
                checkedSchedules.add(scheduleKey);
                const isValidTime = await checkscheduleTime(time[mappedDays[l]][i].end, time[mappedDays[l]][i].start, l, i);
                if (!isValidTime) {
                    logger('error', 'Odrzucono nieprawidłowy zapis czasu!!!', 'massSchedule');
                    continue;
                }
            }
            //checkscheduleTime(time[mappedDays[l]][i].end,time[mappedDays[l]][i].start)
            scheduleMusicTask(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, {id});
            scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
        }
    }
    // console.log(time, day);

    // scheduleMusicTask(`18 17 * * 1-5`, 'Twilight');
    // scheduleKillTask(`19 17 * * 1-5`);
    taskNumber();
}

export { scheduleMusicTask, scheduleKillTask, massSchedule };