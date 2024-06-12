import {Router} from 'express';
import {kill, pMusic, pPlaylist} from "../controllers/actions.controller.js";

const actionsRouter = Router();
actionsRouter.get('/kill', kill);
actionsRouter.get('/play', pMusic);
actionsRouter.get('/playPlaylist', pPlaylist);

export default actionsRouter;