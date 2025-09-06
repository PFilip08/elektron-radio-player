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
            DebugSaveToFile('LocalAPI-dev', 'resetTasks', 'catched_error', e);
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
            DebugSaveToFile('LocalAPI-dev', 'cleanTasks', 'catched_error', e);
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
            DebugSaveToFile('LocalAPI-dev', 'addTask', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - addTask');
        }
    }
}

export async function restartEverything(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI-dev - restartEverything');
        res.status(202).send('Kopanie wszystkiego...');
        process.exit(0);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby restartu wszystkiego', 'LocalAPI-dev - restartEverything');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI-dev', 'restartEverything', 'catched_error', e);
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
            DebugSaveToFile('LocalAPI-dev', 'downloadYToverride', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - downloadYToverride');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów');
    }
}

export async function removeTask(req, res) {
    try {
        const taskName = req.query.name;
        if (!taskName) return res.status(400).send('Brak nazwy zadania!');
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')} - usuwanie zadania: ${taskName}`, 'LocalAPI-dev - removeTask');
        const job = schedule.scheduledJobs[taskName];
        if (!job) return res.status(404).send('Nie znaleziono zadania o nazwie: ' + taskName);

        job.cancel();
        delete schedule.scheduledJobs[taskName];
        taskNumber();

        logger('log', 'Zadanie "' + taskName + '" zostało usunięte!', 'LocalAPI-dev - removeTask')
        return res.status(200).send('Zadanie "' + taskName + '" zostało usunięte!');
    } catch (e) {
        logger('verbose', 'Błąd podczas usuwania zadania', 'LocalAPI-dev - removeTask');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI-dev', 'removeTask', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - removeTask');
        }
        return res.status(500).send('Błąd podczas usuwania zadania');
    }
}

export async function devAPI(req, res) {
    try {
        const action = req.query.action;

        logger('log', `DevAPI request: ${action} od ${req.hostname}`, 'LocalAPI-dev - devAPI');

        if (!action) {
            const currentMockData = global.devAPIMockData || {
                timeTables: {
                    isOn: true,
                    currentPlaylistId: 1,
                    timeRules: {
                        rules: {
                            "1": [
                                {"end": "07:10", "start": "07:07"},
                                {"end": "08:00", "start": "07:55"},
                                {"end": "08:50", "start": "08:45"},
                                {"end": "09:45", "start": "09:35"},
                                {"end": "10:35", "start": "10:30"},
                                {"end": "11:40", "start": "11:20"},
                                {"end": "12:30", "start": "12:25"},
                                {"end": "13:20", "start": "13:15"},
                                {"end": "14:10", "start": "14:05"},
                                {"end": "15:00", "start": "14:55"},
                                {"end": "15:50", "start": "15:45"}
                            ]
                        },
                        applyRule: {
                            "Fri": 1, "Mon": 1, "Sat": 0, "Sun": 0, "Thu": 1, "Tue": 1, "Wed": 1
                        }
                    }
                },
                votes: [
                    {
                        id: 1,
                        votes: 25,
                        created_at: new Date().toLocaleDateString('en-CA'),
                        uSongs: {
                            url: "https://music.youtube.com/watch?v=c3Pd7nH7Y40",
                            title: "DevAPI - L'amour Toujours"
                        }
                    },
                    {
                        id: 2,
                        votes: 17,
                        created_at: new Date().toLocaleDateString('en-CA'),
                        uSongs: {
                            url: "https://music.youtube.com/watch?v=dQw4w9WgXcQ",
                            title: "DevAPI - Rickus Astleyus"
                        }
                    }
                ]
            };

            return res.render('dev/devapi', {
                title: 'DevAPI Panel',
                welcome: 'DevAPI Configuration',
                layout: 'layouts/dev_layout',
                devAPIEnabled: global.devAPIEnabled || false,
                mockData: currentMockData,
                overrideTarget: process.env.URI || 'partyvote.ciac.me'
            });
        }

        switch (action) {
            case 'on':
                global.devAPIEnabled = true;
                await massSchedule();
                logger('log', 'DevAPI włączono i zreschedulowano taski', 'LocalAPI-dev - devAPI');
                return res.json({
                    success: true,
                    message: 'DevAPI włączone - używanie mock danych i zreschedulowanie tasków',
                    devAPIEnabled: true
                });

            case 'off':
                global.devAPIEnabled = false;
                await massSchedule();
                logger('log', 'DevAPI wyłączono i zreschedulowano taski', 'LocalAPI-dev - devAPI');
                return res.json({
                    success: true,
                    message: 'DevAPI wyłączone - używanie main API i zreschedulowanie tasków',
                    devAPIEnabled: false
                });

            case 'status':
                return res.json({
                    success: true,
                    devAPIEnabled: global.devAPIEnabled || false,
                    overrideTarget: process.env.URI || 'partyvote.ciac.me',
                    mockData: global.devAPIMockData || {}
                });

            case 'reschedule':
                if (global.devAPIEnabled) {
                    await massSchedule();
                    logger('log', 'Taski zreschedulowane z DevAPI data', 'LocalAPI-dev - devAPI');
                    return res.json({ success: true, message: 'Taski zreschedulowane z DevAPI data' });
                } else {
                    return res.json({ success: false, message: 'zaś DevAPI wyłączone' });
                }

            default:
                return res.status(400).json({
                    error: 'Niestety to nie koncert życzeń',
                    availableActions: ['on', 'off', 'status', 'reschedule']
                });
        }
    } catch (e) {
        logger('verbose', 'Error w devAPI', 'LocalAPI-dev - devAPI');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI-dev', 'devAPI', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - devAPI');
        }
        return res.status(500).json({ error: 'Taboretowy error serwera', message: e.message });
    }
}

export async function devAPITimeTables(req, res) {
    try {
        if (req.method === 'GET') {
            // Return current timeTables data
            const mockTimeTables = global.devAPIMockData?.timeTables || {
                isOn: true,
                currentPlaylistId: 1,
                timeRules: {
                    rules: { "1": [] },
                    applyRule: { "Fri": 1, "Mon": 1, "Sat": 0, "Sun": 0, "Thu": 1, "Tue": 1, "Wed": 1 }
                }
            };

            return res.json({
                timeTable: [mockTimeTables],
                lastUpdated: new Date().toISOString()
            });
        }

        if (req.method === 'POST') {
            if (!global.devAPIMockData) global.devAPIMockData = {};
            // Zamiana currentPlaylistId na obiekt {id: ...} jeśli jest liczbą
            // if (typeof req.body.currentPlaylistId === 'number') {
            //     req.body.currentPlaylistId = { id: req.body.currentPlaylistId };
            // }
            global.devAPIMockData.timeTables = req.body;
            // console.log(global.devAPIMockData.timeTables)
            logger('log', 'Zaktualizowano dane DevAPI TimeTables', 'LocalAPI-dev - devAPITimeTables');

            if (global.devAPIEnabled) {
                await massSchedule();
                logger('log', 'Zaktualizowano dane TimeTables i zreschedulowano taski', 'LocalAPI-dev - devAPITimeTables');
            }

            return res.json({ success: true, message: 'Zaktualizowano dane TimeTables i zreschedulowano taski' });
        }
    } catch (e) {
        logger('verbose', 'Błąd w devAPITimeTables', 'LocalAPI-dev - devAPITimeTables');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI-dev', 'devAPITimeTables', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - devAPITimeTables');
        }
        return res.status(500).json({ error: 'Taboretowy error serwera', message: e.message });
    }
}

export async function devAPIVotes(req, res) {
    try {
        if (req.method === 'GET') {
            const mockVotes = global.devAPIMockData?.votes || [];
            return res.json({ playlist: mockVotes });
        }

        if (req.method === 'POST') {
            if (!global.devAPIMockData) global.devAPIMockData = {};
            global.devAPIMockData.votes = req.body;
            logger('log', 'Zaktualizowano dane DevAPI Votes', 'LocalAPI-dev - devAPIVotes');
            return res.json({ success: true, message: 'Zaktualizowano dane Votes' });
        }
    } catch (e) {
        logger('verbose', 'Błąd w devAPIVotes', 'LocalAPI-dev - devAPIVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI-dev', 'devAPIVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI-dev - devAPIVotes');
        }
        return res.status(500).json({ error: 'Taboretowy error serwera', message: e.message });
    }
}