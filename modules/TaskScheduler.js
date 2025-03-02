import schedule from "node-schedule";
import {killPlayer, pausePlayer, playOnDemand, playPlayer, playPlaylist} from "./MusicPlayer.js";
import {getApiData, messageCounter} from "./ApiConnector.js";
import {autoRemoveFiles, downloader, getTrackInfo} from "./MusicDownloader.js";
import {logger} from "./Logger.js";
import {checkIfVLCisRunning, checkIfVLConVotes, sterylizator} from "./Other.js";
import colors from 'colors';
import {getVotesData} from "./VotesConnector.js";

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
    logger('verbose', 'Sprawdzanie czy playlista nie jest ustawione na 0', 'scheduleMusicTask');
    if (id.id == 0) {
        logger('verbose', colors.yellow("Wykryto playlistę zero!!! Co nie powinno mieć miejsca!"), 'scheduleMusicTask');
        logger('error', 'Playlista zero nie może być odtwarzana!!! A została przekazana do funkcji', 'scheduleMusicTask');
        return;
    }
    logger('verbose', `ID playlisty: ${id.id}`, 'scheduleMusicTask');
    schedule.scheduleJob(time, function () {
        logger('log', 'Granie playlisty nr: '+id.id,'scheduleMusicTask');
        playPlaylist(id.id);
    });
}

function scheduleKillTask(time) {
    logger('verbose', `Zadanie ubicia Pleyera zaplanowane na ${time}`, 'scheduleKillTask');
    schedule.scheduleJob(time, killPlayer);
}

function scheduleVotes(timeStart, timeEnd, id) {
    logger('verbose', `Zadanie zaplanowane na ${timeStart}`, 'scheduleVotes');
    logger('verbose', `Zadanie zapałzowaia (lub ubicia) Pleyera zaplanowane na ${timeEnd}`, 'scheduleVotes');
    logger('verbose', `ID playlisty: ${id} (powinno być 7)`, 'scheduleVotes');
    logger('verbose', 'Sprawdzanie czy playlista nie jest ustawiona na inną playlistę niż 7', 'scheduleVotes');
    if (id !== 7) {
        logger('verbose', colors.yellow("Wykryto playlistę inną niż 7!!! Co nie powinno mieć miejsca!"), 'scheduleVotes');
        logger('error', `${id}, a nie siódma playlista!!! Głosowanie skopane!!!`, 'scheduleVotes');
        return;
    }
    schedule.scheduleJob(timeStart, async function () {
        logger('log', 'Granie playlisty nr: '+id,'scheduleVotes');
        // console.log(await checkIfVLCisRunning(), await checkIfVLConVotes());
        if (await checkIfVLCisRunning() && await checkIfVLConVotes()) {
            await playPlayer();
        } else playPlaylist(id);
    });
    schedule.scheduleJob(timeEnd, function () {
        try {
            pausePlayer();
        } catch (e) {
            killPlayer();
        }
    });
}

async function checkScheduleTime(timeEnd, timeStart, rule, breakNumber) {
    let timeEndArray = timeEnd.split(':');
    let timeStartArray = timeStart.split(':');
    let breakNumberInt = parseInt(breakNumber, 10) + 1;
    logger('verbose', `Sprawdzanie zasady ${rule} i przerwy ${breakNumberInt}`, 'checkScheduleTime');
    breakNumber = (breakNumber + 1);
    if (timeEndArray[0] < timeStartArray[0]) {
        logger('verbose', colors.yellow('WYKRYTO RÓŻNICĘ W GODZINIE!!!'), 'checkScheduleTime');
        logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest wcześniejszy niż czas rozpoczęcia (${timeStart}), różnica wynosi ${(timeStartArray[0] - timeEndArray[0])} godziny.`, 'checkScheduleTime');
        return false;
    }
    if (timeEndArray[0] === timeStartArray[0]) {
        if (timeEndArray[1] < timeStartArray[1]) {
            logger('verbose', colors.yellow('WYKRYTO RÓŻNICĘ W MINUTACH!!!'), 'checkScheduleTime');
            logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest wcześniejszy niż czas rozpoczęcia (${timeStart} aka "start" w JSONie), różnica wynosi ${(timeStartArray[1] - timeEndArray[1])} minut.`, 'checkScheduleTime');
            return false;
        }
        else if (timeEndArray[1] === timeStartArray[1]) {
            logger('verbose', colors.yellow('WYKRYTO BEZ SENSU ZAPIS!!!'), 'checkScheduleTime');
            logger('error', `Dla zasady ${rule} i przerwy ${breakNumberInt}, czas zakończenia (${timeEnd} aka "end" w JSONie) jest taki sam jak czas rozpoczęcia (${timeStart} aka "start" w JSONie).`, 'checkScheduleTime');
            return false;
        }
    }
    logger('verbose', `Zasada ${rule} i przerwa ${breakNumberInt} jest poprawna`, 'checkScheduleTime');
    return true;
}

let downloaded = false, emptyVotes = false;
async function massSchedule() {
    logger('verbose', 'Rozpoczęto masowe planowanie zadań...', 'massSchedule');
    logger('verbose', 'Zatrzymywanie wszystkich zadań', 'massSchedule');
    await schedule.gracefulShutdown();
    logger('verbose', 'Planowanie zadania automatycznego usuwania plików...', 'massSchedule');
    schedule.scheduleJob('0 5 * * 1-5', autoRemoveFiles);
    logger('verbose', 'Planowanie zadania automatycznej aktualizacji głosów...', 'massSchedule');
    schedule.scheduleJob('50 6 * * 1-5', downloadVotes);
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
    async function downloadVotes() {
        logger('verbose', 'Pobieranie danych z getVotesData', 'massSchedule');
        const data = await getVotesData();
        if (data === 'brak') {emptyVotes = true; return logger('log', 'Brak danych!!!', 'massSchedule - downloadVotes')}
        for (let i in data) {
            await downloader(data[i].uSongs.url, true);
        }
    }
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
            if (time[mappedDays[l]][i].playlist === 0) {
                logger('verbose', 'Znaleziono playlistę 0, tylko ubijanie. Kontynuowanie wykonywania pętli...', 'massSchedule');
                scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
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
            if ((messageCounter && time[mappedDays[l]][i].playlist === undefined && currentPlaylist === 7) || emptyVotes) { // gdy nie ma neta i gdy puste głosy
                logger('verbose', colors.yellow('Wykryto brak internetu lub pusty response z funkcji getVotesData! Losowanie playlist statycznych...'), 'massSchedule');
                const id = Math.floor(Math.random() * 5) + 1; // rosyjska ruletka od 1 do 5
                scheduleMusicTask(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, {id});
                scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
                // console.log("Taboret losował: ", id);
                continue;
            }
            if (currentPlaylist !== 7 && !messageCounter && time[mappedDays[l]][i].playlist === 7 && !downloaded) {
                logger('verbose', 'Znaleziono playlistę 7! Uruchamianie pobierania piosenek z głosowania', 'massSchedule');
                downloaded = true;
                await downloadVotes();
            }
            if (currentPlaylist === 7) { // gdy główna na 7
                scheduleVotes(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, `${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, id);
                continue;
            }
            if (time[mappedDays[l]][i].OnDemand !== undefined) {
                logger('verbose', 'Znaleziono OnDemand!!!', 'massSchedule');
                logger('log', 'ONDEMAND OMAJGAH!!!1!111!!1!1!!!', 'massSchedule');
                await downloader(time[mappedDays[l]][i].OnDemand);
                const trackInfo = await getTrackInfo(time[mappedDays[l]][i].OnDemand);
                schedule.scheduleJob(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, function () {
                    playOnDemand(sterylizator(trackInfo.artists.join('-')+'_'+trackInfo.name));
                    logger('log', `On Demand: ${trackInfo.name+ ' by '+ trackInfo.artists.join(' ')}`,'massSchedule');
                });
                scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
                continue;
            }

            logger('verbose', 'Planowanie zadań...', 'massSchedule');
            if (id === 7) { // gdy pojedyncza na 7
                logger('verbose', 'Znaleziono playlistę 7! Uruchamianie planowania dla niej zadania...', 'massSchedule');
                scheduleVotes(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, `${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`, id);
                continue;
            }
            scheduleMusicTask(`${time[mappedDays[l]][i].start.split(':').reverse().join(' ')} * * ${l}`, {id});
            scheduleKillTask(`${time[mappedDays[l]][i].end.split(':').reverse().join(' ')} * * ${l}`);
        }
    }
    taskNumber();
}

export { scheduleMusicTask, scheduleKillTask, massSchedule };