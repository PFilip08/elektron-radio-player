import {Router} from 'express';
import {getScheduledTasks} from "../../modules/TaskScheduler.js";

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

export default devRouter;