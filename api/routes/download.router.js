import {Router} from 'express';
import {downloadAndPlay, downloadSong} from "../controllers/download.controller.js";

const downloadRouter = Router();
downloadRouter.post('/', downloadSong);
downloadRouter.post('/override', downloadAndPlay);

export default downloadRouter;