import {Router} from 'express';
import {queryPlayingMusic, queryPlaylistList, queryPlaylist, queryRecoveryModeStatus} from '../controllers/status.controller.js';

const statusRouter = Router();  
statusRouter.post('/query/playing', queryPlayingMusic);
statusRouter.post('/query/playlist/list', queryPlaylistList);
statusRouter.post('/query/playlist/songs', queryPlaylist);
statusRouter.get('/query/recoveryMode', queryRecoveryModeStatus);

export default statusRouter;