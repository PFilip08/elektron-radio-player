import {Router} from 'express';
import {delFiles, kill, normalize, pMusic, pPlaylist, vlcNext, vlcPlay, vlcPrevious, vlcSzuffle} from "../controllers/actions.controller.js";

const actionsRouter = Router();
actionsRouter.post('/kill', kill);
actionsRouter.post('/play', pMusic);
actionsRouter.post('/playPlaylist', pPlaylist);

actionsRouter.post('/vlcPlay', vlcPlay);
actionsRouter.post('/vlcNext', vlcNext);
actionsRouter.post('/vlcPrevious', vlcPrevious);
actionsRouter.get('/vlcSzuffle', vlcSzuffle);
actionsRouter.post('/vlcSzuffle', vlcSzuffle);

actionsRouter.post('/delFiles', delFiles);
actionsRouter.post('/normalize', normalize);

export default actionsRouter;