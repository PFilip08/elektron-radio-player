import {logger} from "../../modules/Logger.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {massSchedule, taskNumber} from "../../modules/TaskScheduler.js";
import schedule from "node-schedule";
import {killPlayer, playMusic, playPlaylist} from "../../modules/MusicPlayer.js";
import {downloadYT} from "../../modules/MusicDownloader.js";
import * as fs from "fs";

export async function resetTasks(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI-dev - resetTasks');
        await massSchedule();
        return res.status(202).send('resetd');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby resetu massSchedulera', 'LocalAPI-dev - resetTasks');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'resetTasks', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - resetTasks');
        }
    }
}

export async function cleanTasks(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI-dev - cleanTasks');
        await schedule.gracefulShutdown();
        taskNumber();
        return res.status(202).send('cleaned');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby czyszczenia massSchedulera', 'LocalAPI-dev - cleanTasks');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'cleanTasks', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - cleanTasks');
        }
    }
}

export async function addTask(req, res) {
    try {
        const taskName = req.body.taskName;
        const taskType = req.body.taskType;
        let taskDate = req.body.taskDate;
        taskDate = new Date(taskDate);

        let taskData = {};
        try {
            taskData = req.body.taskData ? JSON.parse(req.body.taskData) : {};
        } catch (e) {
            logger('warn', 'Nieprawidłowy JSON w polu taskData!', 'LocalAPI-dev - addTask');
            return res.status(400).send('Nieprawidłowy JSON w polu taskData!');
        }

        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI-dev - addTask');

        if (!taskName || !taskType || !taskDate) {
            logger('warn', 'Nie podano wszystkich wymaganych pól!', 'LocalAPI-dev - addTask');
            return res.status(400).send('Nie podano wszystkich wymaganych pól!');
        }

        switch (taskType) {
            case 'playMusic':
                if (!taskData.filename) {
                    logger('warn', 'Nie podano nazwy pliku!', 'LocalAPI-dev - addTask');
                    return res.status(400).send('Nie podano nazwy pliku!');
                }
                const jobMusic = schedule.scheduleJob(taskName, taskDate, function () {
                    logger('log', 'Odtwarzanie pliku: '+taskData.file, 'LocalAPI-dev - addTask');
                    playMusic(taskData.filename)
                });
                jobMusic.jobData = { filename: taskData.filename };
                break;
            case 'playPlaylist':
                if (!taskData.id) {
                    logger('warn', 'Nie podano ID playlisty!', 'LocalAPI-dev - addTask');
                    return res.status(400).send('Nie podano ID playlisty!');
                }
                const jobPlaylist = schedule.scheduleJob(taskName, taskDate, function () {
                    logger('log', 'Granie playlisty nr: '+taskData.id, 'LocalAPI-dev - addTask');
                    playPlaylist(taskData.id);
                });
                jobPlaylist.jobData = { id: taskData.id };
                break;
            case 'killPlayer':
                const jobKill = schedule.scheduleJob(taskName, taskDate, function () {
                    logger('log', 'Zatrzymywanie odtwarzacza', 'LocalAPI-dev - addTask');
                    killPlayer();
                });
                break;
            case 'inne':
                return res.status(400).send('Nie zaimplementowano tego typu w tej wersji API!!1!11!!!');
                // const jobInne = schedule.scheduleJob(taskName, taskDate, function () {
                //     logger('log', 'Wykonywanie innego zadania', 'LocalAPI-dev - addTask');
                //     // tutaj coś kiedyś będzie
                // });
            default:
                logger('warn', `Nieznany typ zadania: ${taskType}`, 'LocalAPI-dev - addTask');
                return res.status(400).send('Nieznany typ zadania!');
        }
        taskNumber();
        // return res.status(201).send('cleaned');
        return res.redirect('/dev/schedules/addTask?status=added');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby dodania taskadania', 'LocalAPI-dev - addTask');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'addTask', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - addTask');
        }
    }
}

export async function restartEverything(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI-dev - restartEverything');
        res.status(202).send('Restarting...');
        process.exit(0);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby restartu wszystkiego', 'LocalAPI-dev - restartEverything');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'restartEverything', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - restartEverything');
        }
    }
}

export async function downloadYToverride(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI-dev - downloadYToverride');
        const url = req.query.url;
        let path = req.query.path || './mp3/onDemand/';
        if (!url) return res.status(400).send('Nie podano URL!');
        if (path.length < 6 || !path.startsWith('./mp3/')) return res.status(400).send('Niepoprawna ścieżka!');
        if (!path.endsWith('/')) path = path+'/';
        if(!fs.existsSync(path)) fs.mkdirSync(path);
        await downloadYT(url, false, path, true);
        return res.status(201).send(`gut, ${path}`);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby pobrania override z yt!!', 'LocalAPI-dev - downloadYToverride');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'downloadYToverride', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - downloadYToverride');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów');
    }
}