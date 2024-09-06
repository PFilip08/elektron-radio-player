import {Router} from 'express';
import {kill, pMusic, pPlaylist, vlcNext, vlcPlay, vlcPrevious} from "../controllers/actions.controller.js";

const actionsRouter = Router();
actionsRouter.get('/kill', kill);
actionsRouter.get('/play', pMusic);
actionsRouter.get('/playPlaylist', pPlaylist);

actionsRouter.get('/vlcPlay', vlcPlay);
actionsRouter.get('/vlcNext', vlcNext);
actionsRouter.get('/vlcPrevious', vlcPrevious);


export default actionsRouter;