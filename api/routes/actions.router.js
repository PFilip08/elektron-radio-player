import {Router} from 'express';
import {delFiles, kill, pMusic, pPlaylist, vlcNext, vlcPlay, vlcPrevious, vlcSzuffle} from "../controllers/actions.controller.js";

const actionsRouter = Router();
actionsRouter.get('/kill', kill);
actionsRouter.get('/play', pMusic);
actionsRouter.get('/playPlaylist', pPlaylist);

actionsRouter.get('/vlcPlay', vlcPlay);
actionsRouter.get('/vlcNext', vlcNext);
actionsRouter.get('/vlcPrevious', vlcPrevious);
actionsRouter.get('/vlcSzuffle', vlcSzuffle);

actionsRouter.get('/delFiles', delFiles);

export default actionsRouter;