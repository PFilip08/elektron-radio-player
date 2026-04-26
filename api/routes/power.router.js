import {Router} from 'express';
import {mixerPower, wzmakPower} from "../controllers/power.controller.js";
import {__dirname} from '../app.js';

const powerRouter = Router();
powerRouter.post('/wzmak', wzmakPower);
powerRouter.post('/mixer', mixerPower);
powerRouter.get('/stats', (req, res) => {
    res.render('powerstats', {
        title: 'Power Stats Panel',
        welcome: 'Statystyki prundu',
        navbar: false,
    });
});

export default powerRouter;