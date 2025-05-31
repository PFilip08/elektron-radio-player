import {Router} from 'express';
import {getScheduledTasks} from "../../modules/TaskScheduler.js";
import {addTask, cleanTasks, resetTasks} from "../controllers/dev.controller.js";
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

devRouter.get('/schedules/resetTasks', resetTasks);
devRouter.get('/schedules/cleanTasks', cleanTasks);
devRouter.use(bodyParser.urlencoded({ extended: true })).post('/schedules/addTask', addTask);
// devRouter.post('/schedules/addTask', addTask);

export default devRouter;