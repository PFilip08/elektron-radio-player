import {logger} from "../../modules/Logger.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {massSchedule, taskNumber} from "../../modules/TaskScheduler.js";
import schedule from "node-schedule";

export async function resetTasks(req, res) {
    try {
        await massSchedule();
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - resetTasks');
        return res.status(201).send('resetd');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby resetu massSchedulera', 'LocalAPI - resetTasks');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'resetTasks', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - resetTasks');
        }
    }
}

export async function cleanTasks(req, res) {
    try {
        await schedule.gracefulShutdown();
        taskNumber();
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - cleanTasks');
        return res.status(201).send('cleaned');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby resetu massSchedulera', 'LocalAPI - cleanTasks');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'cleanTasks', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - cleanTasks');
        }
    }
}