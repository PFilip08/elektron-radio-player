import {Router} from 'express';
import {queryPlayingMusic, queryPlaylistList, queryPlaylist} from '../controllers/status.controller.js';

const statusRouter = Router();  
statusRouter.get('/query/playing', queryPlayingMusic);
statusRouter.get('/query/playlist/list', queryPlaylistList);
statusRouter.get('/query/playlist/songs', queryPlaylist);

export default statusRouter;