import {Router} from 'express';
import {mixerPower, wzmakPower} from "../controllers/power.controller.js";

const powerRouter = Router();
powerRouter.get('/wzmak', wzmakPower);
powerRouter.get('/mixer', mixerPower);

export default powerRouter;