import {Router} from 'express';
import {getScheduledTasks} from "../../modules/TaskScheduler.js";
import {addTask, cleanTasks, downloadYToverride, resetTasks, restartEverything, removeTask, devAPI, devAPITimeTables, devAPIVotes, devOverrideRecoveryLock} from "../controllers/dev.controller.js";
import * as bodyParser from "express";

const devRouter = Router();
devRouter.get('/', (req, res) => {
    res.render('dev/root', {
        title: 'Dev Panel',
        welcome: 'Dev Panel',
        layout: 'layouts/dev_layout',
    });
});

devRouter.get('/schedules', (req, res) => {
    const tasks = getScheduledTasks();
    res.render('dev/schedulepanel', {
        title: 'Schedules Panel',
        welcome: 'Schedules Panel',
        layout: 'layouts/dev_layout',
        tasks: tasks,
    });
});

devRouter.get('/schedules/addTask', (req, res) => {
    res.render('dev/addTask', {
        title: 'addTask Panel',
        welcome: 'Dodawanie tasków',
        navbar: false,
        layout: 'layouts/dev_layout',
        status: req.query.status,
    });
});

devRouter.get('/override', (req, res) => {
    res.render('dev/overridepanel', {
        title: 'Override Panel',
        welcome: 'Override Panel',
        layout: 'layouts/dev_layout',
    });
});

devRouter.post('/schedules/resetTasks', resetTasks);
devRouter.post('/schedules/cleanTasks', cleanTasks);
devRouter.delete('/schedules/removeTask', removeTask);
devRouter.use(bodyParser.urlencoded({ extended: true })).post('/schedules/addTask', addTask);
devRouter.post('/action/restart', restartEverything);
devRouter.post('/action/downloadYToverride', downloadYToverride);
devRouter.post('/action/resetRecoveryLock', devOverrideRecoveryLock);
devRouter.get('/api', devAPI);
devRouter.get('/api/timeTables', devAPITimeTables);
devRouter.post('/api/timeTables', bodyParser.json(), devAPITimeTables);
devRouter.get('/api/votes', devAPIVotes);
devRouter.post('/api/votes', bodyParser.json(), devAPIVotes);


export default devRouter;