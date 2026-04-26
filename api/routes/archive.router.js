import {Router} from 'express';
import {searchArchive, listArchive, queryArchive, deleteArchiveFile, getArchiveFolders, checkCopyFromArchive, copyPlaylist } from "../controllers/archive.controller.js";

const archiveRouter = Router();

archiveRouter.post('/searchArchive', searchArchive);
archiveRouter.post('/listArchive', listArchive);
archiveRouter.post('/archiveSongsQuery', queryArchive);
archiveRouter.delete('/deleteArchive', deleteArchiveFile);
archiveRouter.post('/getArchiveFolders', getArchiveFolders);
archiveRouter.post('/copyFromArchive', checkCopyFromArchive);
archiveRouter.post('/copyPlaylist', copyPlaylist);

export default archiveRouter;