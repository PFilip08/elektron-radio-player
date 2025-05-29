import {Router} from 'express';
import {getScheduledTasks} from "../../modules/TaskScheduler.js";
import {cleanTasks, resetTasks} from "../controllers/dev.controller.js";

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
devRouter.get('/override', (req, res) => {
    res.render('dev/overridepanel', {
        title: 'Override Panel',
        welcome: 'Override Panel',
        layout: 'layouts/dev_layout',
    });
});

devRouter.get('/schedules/resetTasks', resetTasks);
devRouter.get('/schedules/cleanTasks', cleanTasks);

export default devRouter;