import {Router} from 'express';
import {mixerPower, wzmakPower} from "../controllers/power.controller.js";
import {__dirname} from '../app.js';

const powerRouter = Router();
powerRouter.get('/wzmak', wzmakPower);
powerRouter.get('/mixer', mixerPower);
powerRouter.get('/stats', (req, res) => {
    res.sendFile(__dirname+'/public/powerreportpage.html');
});

export default powerRouter;