import schedule from "node-schedule";
import {killPlayer, killPlayerForce, pausePlayer, playOnDemand, playPlayer, playPlaylist, getPlayingSong} from "./MusicPlayer.js";
import {getApiData, messageCounter} from "./ApiConnector.js";
import {autoRemoveFiles, downloader, getTrackInfo} from "./MusicDownloader.js";
import {logger} from "./Logger.js";
import {checkIfVLCisRunning, checkIfVLConVotes, sterylizator} from "./Other.js";
import {getVotesData} from "./VotesConnector.js";
import { Mutex } from 'async-mutex';
import {yellow} from 'colorette';
import { playlistCache } from "../api/controllers/status.controller.js";

function taskNumber() {
    let n = 0;
    logger('verbose', 'Sprawdzanie liczby zrobionych zadań...', 'taskNumber');
    for (let i in schedule.scheduledJobs) {
        n = n+1;
    }
    return logger('task', `Liczba zadań: ${n}`, 'taskNumber');
}

function scheduleMusicTask(time, id, i) {
    logger('verbose', `Zadanie zaplanowane na ${time}`, 'scheduleMusicTask');
    logger('verbose', 'Sprawdzanie czy playlista nie jest ustawione na 0', 'scheduleMusicTask');
    if (id.id == 0) {
        logger('verbose', yellow("Wykryto playlistę zero!!! Co nie powinno mieć miejsca!"), 'scheduleMusicTask');
        logger('error', 'Playlista zero nie może być odtwarzana!!! A została przekazana do funkcji', 'scheduleMusicTask');
        return;
    }
    logger('verbose', `ID playlisty: ${id.id}`, 'scheduleMusicTask');
    const job = schedule.scheduleJob(`playPlaylist - ${new Date().toLocaleString()}, ${i[0]}/${i[1]}`, time, function () {
        logger('log', 'Granie playlisty nr: '+id.id,'scheduleMusicTask');
        playPlaylist(id.id);
    });
    job.jobData = { id: id.id };
}

function scheduleKillTask(time, i) {
    logger('verbose', `Zadanie ubicia Pleyera zaplanowane na ${time}`, 'scheduleKillTask');
    let dzien = 'onDemand';
    if (i) dzien = `${i[0]}/${i[1]}`;
    schedule.scheduleJob(`killPlayer - ${new Date().toLocaleString()}, ${dzien}`, time, killPlayer);
}

function scheduleVotes(timeStart, timeEnd, id, i) {
    logger('verbose', `Zadanie zaplanowane na ${timeStart}`, 'scheduleVotes');
    logger('verbose', `Zadanie zapałzowaia (lub ubicia) Pleyera zaplanowane na ${timeEnd}`, 'scheduleVotes');
    logger('verbose', `ID playlisty: ${id} (powinno być 7)`, 'scheduleVotes');
    logger('verbose', 'Sprawdzanie czy playlista nie jest ustawiona na inną playlistę niż 7', 'scheduleVotes');
    if (id !== 7) {
        logger('verbose', yellow("Wykryto playlistę inną niż 7!!! Co nie powinno mieć miejsca!"), 'scheduleVotes');
        logger('error', `${id}, a nie siódma playlista!!! Głosowanie skopane!!!`, 'scheduleVotes');
        return;
    }
    const jobPlay = schedule.scheduleJob(`playPlayer - ${new Date().toLocaleString()}, ${i[0]}/${i[1]}`, timeStart, async function () {
        logger('log', 'Granie playlisty nr: '+id,'scheduleVotes');
        if (await checkIfVLCisRunning() && await checkIfVLConVotes()) {
            await playPlayer();
        } else playPlaylist(id);
    });
    jobPlay.jobData = { id };
    
    const jobPause = schedule.scheduleJob(`pausePlayer - ${new Date().toLocaleString()}, ${i[0]}/${i[1]}`, timeEnd, async function () {
        try {
            await pausePlayer();
        } catch (e) {
            logger('error', `Błąd taska od pauzowania plejera: ${e}`, 'scheduleVotes - taskPausePlayer');
            killPlayerForce();
        }
    });
    jobPause.jobData = { id };
}

async function downloadVotes() {
    logger('verbose', 'Pobieranie danych z getVotesData', 'massSchedule - downloadVotes');
    const data = await getVotesData();
    playlistCache.delete("7"); // usuwanie cache dla playlisty 7, bo głosy się zmieniły
    if (data === 'brak') {emptyVotes = true; return logger('log', 'Brak danych!!!', 'massSchedule - downloadVotes')}
    for (let i in data) {
        await downloader(data[i].uSongs.url, true);
    }
}

async function scheduleMinorTasks() {
    logger('verbose', 'Planowanie zadania automatycznego usuwania plików...', 'scheduleMinorTasks');
    schedule.scheduleJob(`autoRemoveFiles - ${new Date().toLocaleString()}`, '0 5 * * 1-5', autoRemoveFiles);
    logger('verbose', 'Planowanie zadania automatycznej aktualizacji głosów...', 'scheduleMinorTasks');
    schedule.scheduleJob(`downloadVotes - ${new Date().toLocaleString()}`, '50 6 * * 1-5', downloadVotes);
}

async function checkScheduleTime(timeEnd, timeStart, rule, breakNumber) {
    let timeEndArray = timeEnd.split(':');
    let timeStartArray = timeStart.split(':');
    let breakNumberInt = parseInt(breakNumber, 10) + 1;
    logger('verbose', `Sprawdzanie zasady ${rule} i przerwy ${breakNumberInt}`, 'checkScheduleTime');
    breakNumber = (breakNumber + 1);
    if (timeEndArray[0] < timeStartArray[0]) {
        logger('verbose', yellow('WYKRYTO RÓŻNICĘ W GODZINIE!!!'), 'checkScheduleTime');
        logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest wcześniejszy niż czas rozpoczęcia (${timeStart}), różnica wynosi ${(timeStartArray[0] - timeEndArray[0])} godziny.`, 'checkScheduleTime');
        return false;
    }
    if (timeEndArray[0] === timeStartArray[0]) {
        if (timeEndArray[1] < timeStartArray[1]) {
            logger('verbose', yellow('WYKRYTO RÓŻNICĘ W MINUTACH!!!'), 'checkScheduleTime');
            logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest wcześniejszy niż czas rozpoczęcia (${timeStart} aka "start" w JSONie), różnica wynosi ${(timeStartArray[1] - timeEndArray[1])} minut.`, 'checkScheduleTime');
            return false;
        }
        else if (timeEndArray[1] === timeStartArray[1]) {
            logger('verbose', yellow('WYKRYTO BEZ SENSU ZAPIS!!!'), 'checkScheduleTime');
            logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest taki sam jak czas rozpoczęcia (${timeStart} aka "start" w JSONie).`, 'checkScheduleTime');
            return false;
        }
    }
    logger('verbose', `Zasada ${rule} i przerwa ${breakNumberInt} jest poprawna`, 'checkScheduleTime');
    return true;
}

let downloaded = false, emptyVotes = false, massScheduleDelayed = false;
let blockmassSchedule = new Mutex();
async function massSchedule() {
    if (massScheduleDelayed) {
        logger('verbose', yellow(console.trace()), 'massSchedule');
        logger('warn', 'massSchedule jest już odroczone, pomijanie ponownego uruchamiania...', 'massSchedule');
        return;
    }
    if ((await getPlayingSong())[0] == true && !massScheduleDelayed) {
        logger('verbose', yellow('WYKRYTO, ŻE VLC JEST URUCHOMIONE PODCZAS WYKONYWANIA MASSSCHEDULE!!!'), 'massSchedule');
        logger('warn', 'VLC jest uruchomione podczas wykonywania massSchedule, co może powodować rzadki błąd typu Race Condition i nie ubicie muzyki!!! Odraczanie wykonania massschedule gdy VLC skończy puszczać muzykę', 'massSchedule');
        massScheduleDelayed = true;
        delayMassScheduleVLC();
        return;
    }
    await blockmassSchedule.runExclusive(async () => {
        logger('verbose', 'Rozpoczęto masowe planowanie zadań...', 'massSchedule');
        logger('verbose', 'Zatrzymywanie wszystkich zadań', 'massSchedule');
        await schedule.gracefulShutdown();
        await scheduleMinorTasks();
        logger('verbose', 'Pobieranie danych przy użyciu getApiData', 'massSchedule');
        const data = await getApiData();
        logger('verbose', 'Sprawdzanie czy isOn jest ustawione na false', 'massSchedule');
        if (!data.isOn) {
            logger('verbose', `Zwrócono ${JSON.stringify(data)}}`, 'massSchedule');
            taskNumber();
            return logger('error','Brakuje danych!!!', 'massSchedule');
        }
        const time = data.timeRules.rules;
        const day = data.timeRules.applyRule;
        const currentPlaylist = data.currentPlaylistId;

        // pobieranie
        downloaded = false;
        emptyVotes = false;
        logger('verbose', 'Sprawdzanie czy głosowanie jest włączone, czy jest internet oraz czy już nie pobrano głosów...', 'massSchedule');
        if (currentPlaylist === 7 && !messageCounter && !downloaded) {
            logger('verbose', 'Głosowanie jest włączone, jest internet i nie pobrano głosów', 'massSchedule');
            downloaded = true;
            logger('verbose', 'Dzwonienie do funkcji downloadVotes...', 'massSchedule');
            await downloadVotes();
        }

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
                const scheduleKey = `${time[mappedDays[l]][i].start}-${time[mappedDays[l]][i].end}`;
                let id = currentPlaylist;
                if (time[mappedDays[l]][i].playlist !== undefined && currentPlaylist !== 7 ) {
                    logger('verbose', `Znaleziono playlistę!`, 'massSchedule');
                    id = time[mappedDays[l]][i].playlist;
                }
                logger('verbose', 'Planowanie zadań...', 'massSchedule');
                if (time[mappedDays[l]][i].playlist === 0) {
                    logger('verbose', 'Znaleziono playlistę 0, planowanie tylko ubijania plejera. Kontynuowanie wykonywania pętli...', 'massSchedule');
                    scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, [l, i]);
                    continue;
                }
                if (!checkedSchedules.has(scheduleKey)) {
                    logger('verbose', `Sprawdzanie zapisu czasu ${scheduleKey}`, 'massSchedule');
                    checkedSchedules.add(scheduleKey);
                    const isValidTime = await checkScheduleTime(time[mappedDays[l]][i].end, time[mappedDays[l]][i].start, mappedDays[l], i);
                    if (!isValidTime) {
                        logger('error', 'Odrzucono nieprawidłowy zapis czasu!!!', 'massSchedule');
                        continue;
                    }
                }
                if ((!global.devAPIEnabled && messageCounter && time[mappedDays[l]][i].playlist === undefined && currentPlaylist === 7) || emptyVotes) { // gdy nie ma neta i gdy puste głosy
                    logger('verbose', yellow('Wykryto brak internetu lub pusty response z funkcji getVotesData! Losowanie playlist statycznych...'), 'massSchedule');
                    const id = Math.floor(Math.random() * 5) + 1; // rosyjska ruletka od 1 do 5
                    scheduleMusicTask(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, {id}, [l, i]);
                    scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, [l, i]);
                    // console.log("Taboret losował: ", id);
                    continue;
                }
                if (currentPlaylist !== 7 && !messageCounter && time[mappedDays[l]][i].playlist === 7 && !downloaded) {
                    logger('verbose', 'Znaleziono playlistę 7! Uruchamianie pobierania piosenek z głosowania', 'massSchedule');
                    downloaded = true;
                    // console.log('głosy pozdrawiam');
                    await downloadVotes();
                }
                if (currentPlaylist === 7) { // gdy główna na 7
                    logger('verbose', 'Główna playlista na 7! Planowanie dla głosów...')
                    scheduleVotes(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, `${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, id, [l, i]);
                    continue;
                }
                if (time[mappedDays[l]][i].OnDemand !== undefined) {
                    logger('verbose', 'Znaleziono OnDemand!!!', 'massSchedule');
                    logger('log', 'ONDEMAND OMAJGAH!!!1!111!!1!1!!!', 'massSchedule');
                    await downloader(time[mappedDays[l]][i].OnDemand);
                    const trackInfo = await getTrackInfo(time[mappedDays[l]][i].OnDemand);
                    schedule.scheduleJob(`playOnDemand - ${new Date().toLocaleString()}, ${l}/${i}`, `${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, function () {
                        playOnDemand(sterylizator(trackInfo.artists.join('-')+'_'+trackInfo.name));
                        logger('log', `On Demand: ${trackInfo.name+ ' by '+ trackInfo.artists.join(' ')}`,'massSchedule');
                    });
                    scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, [l, i]);
                    continue;
                }
                if (id === 7) { // gdy pojedyncza na 7
                    logger('verbose', 'Znaleziono playlistę 7! Uruchamianie planowania dla niej zadania...', 'massSchedule');
                    scheduleVotes(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, `${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, id, [l, i]);
                    continue;
                }
                scheduleMusicTask(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, {id}, [l, i]);
                scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, [l, i]);
            }
        }
        taskNumber();
    });
}

let delayTimer = null;

async function delayMassScheduleVLC() {
    if (delayTimer) {
        logger('warn', 'Funkcja delayMassScheduleVLC już działa, pomijanie ponownego uruchamiania...', 'delayMassScheduleVLC');
        logger('verbose', yellow(console.trace()), 'delayMassScheduleVLC');
        return;
    }; // już działa

    const tick = async () => {
        const [isPlaying] = await getPlayingSong();
        if (!isPlaying) {
            logger('verbose', 'VLC przestało grać, uruchamianie massSchedule...', 'delayMassScheduleVLC');
            massScheduleDelayed = false;
            delayTimer = null;
            await massSchedule();
            return;
        }
        logger('verbose', 'VLC nadal gra, czekanie 1 sekundę przed ponownym sprawdzeniem...', 'delayMassScheduleVLC');
        delayTimer = setTimeout(tick, 1000);
    };
    logger('verbose', 'Uruchamianie sprawdzania stanu VLC...', 'delayMassScheduleVLC');
    delayTimer = setTimeout(tick, 1000);
}
// dzięki copilot :>
function getScheduledTasks() {
    return Object.keys(schedule.scheduledJobs).map(jobName => {
        let DSTDate = new Date();
        const job = schedule.scheduledJobs[jobName];
        const jobData = job.jobData || {};

        // ~~utc+2~~ teraz automatyczne jest dostosowywanie do DST :3
        const nextInvocation = job.nextInvocation();
        if (!nextInvocation) return { name: jobName, date: '', time: '', command: job.job.toString(), variables: jobData };
        const nextTimeWithOffset = new Date(nextInvocation.getTime() + (DSTDate.getTimezoneOffset() / -60) * 60 * 60 * 1000);

        return {
            name: jobName,
            date: nextTimeWithOffset.toISOString().split('T')[0],
            time: nextTimeWithOffset.toISOString().split('T')[1].split('.')[0],
            command: job.job.toString(),
            variables: jobData,
        };
    });
}

export { scheduleMusicTask, scheduleKillTask, massSchedule, getScheduledTasks, taskNumber, scheduleMinorTasks, emptyVotes, downloaded, downloadVotes };