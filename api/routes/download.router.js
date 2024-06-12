import {Router} from 'express';
import {downloadAndPlay, downloadSong} from "../controllers/download.controller.js";

const downloadRouter = Router();
downloadRouter.get('/', downloadSong);
downloadRouter.get('/override', downloadAndPlay);

export default downloadRouter;