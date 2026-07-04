import {Router} from 'express';
import {mixerPower, wzmakPower} from "../controllers/power.controller.js";
import {__dirname} from '../app.js';

const powerRouter = Router();
powerRouter.get('/stats', (req, res) => {
    res.render('powerstats', {
        title: 'Power Stats Panel',
        welcome: 'Statystyki prundu',
        navbar: false,
    });
});
powerRouter.get('/wzmak', wzmakPower);
powerRouter.post('/wzmak', wzmakPower);
powerRouter.get('/mixer', mixerPower);
powerRouter.post('/mixer', mixerPower);

export default powerRouter;