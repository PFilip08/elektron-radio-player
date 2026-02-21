import {Router} from 'express';
import {searchArchive, listArchive, queryArchive, deleteArchiveFile, getArchiveFolders, checkCopyFromArchive, copyPlaylist } from "../controllers/archive.controller.js";

const archiveRouter = Router();

archiveRouter.get('/searchArchive', searchArchive);
archiveRouter.get('/listArchive', listArchive);
archiveRouter.get('/archiveSongsQuery', queryArchive);
archiveRouter.delete('/deleteArchive', deleteArchiveFile);
archiveRouter.get('/getArchiveFolders', getArchiveFolders);
archiveRouter.post('/copyFromArchive', checkCopyFromArchive);
archiveRouter.post('/copyPlaylist', copyPlaylist);

export default archiveRouter;