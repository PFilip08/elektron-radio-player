import {Router} from 'express';
import {searchArchive, listArchive, queryArchive, deleteArchiveFile} from "../controllers/archive.controller.js";

const archiveRouter = Router();

archiveRouter.get('/searchArchive', searchArchive);
archiveRouter.get('/listArchive', listArchive);
archiveRouter.get('/archiveSongsQuery', queryArchive);
archiveRouter.delete('/deleteArchive', deleteArchiveFile);

export default archiveRouter;