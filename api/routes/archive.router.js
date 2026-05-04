import {Router} from 'express';
import {searchArchive, listArchive, queryArchive, deleteArchiveFile, getArchiveFolders, checkCopyFromArchive, movePlaylist } from "../controllers/archive.controller.js";

const archiveRouter = Router();

archiveRouter.post('/searchArchive', searchArchive);
archiveRouter.get('/listArchive', listArchive);
archiveRouter.get('/archiveSongsQuery', queryArchive);
archiveRouter.delete('/deleteArchive', deleteArchiveFile);
archiveRouter.get('/getArchiveFolders', getArchiveFolders);
archiveRouter.post('/copyFromArchive', checkCopyFromArchive);
archiveRouter.post('/movePlaylist', movePlaylist);

export default archiveRouter;