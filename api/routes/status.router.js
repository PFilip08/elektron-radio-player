import {Router} from 'express';
import {queryPlayingMusic, queryPlaylistList, queryPlaylist, queryRecoveryModeStatus} from '../controllers/status.controller.js';

const statusRouter = Router();  
statusRouter.get('/query/playing', queryPlayingMusic);
statusRouter.get('/query/playlist/list', queryPlaylistList);
statusRouter.get('/query/playlist/songs', queryPlaylist);
statusRouter.post('/query/playlist/songs', queryPlaylist);
statusRouter.get('/query/recoveryMode', queryRecoveryModeStatus);

export default statusRouter;