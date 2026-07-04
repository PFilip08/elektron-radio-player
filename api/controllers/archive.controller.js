import {logger} from "../../modules/Logger.js";
import {sterylizatorIP} from "../../modules/Other.js";
import {pathSecurityChecker} from "../../modules/Other.js";
import fs from 'fs';
import path from 'path';
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {getPlaylistName} from "../../modules/MusicPlayer.js";
import {searchInArchive, getAllMp3FilesInArchive, archiveSongsQuery, deleteFromArchive, getArchiveSubfolders, copyFromArchive, copyFromArchiveToSix, movePlaylistToArchive, archdir} from "../../modules/ArchiveModule.js";

export async function searchArchive(req, res) {
    try {
        const file = req.query.file;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - searchArchive');
        if (!file) {
            return res.status(400).send('Nie podano nazwy pliku!');
        }
        const query = await searchInArchive(file);
        return res.status(200).send(query);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby wyszukania pliku w archiwum', 'LocalAPI - searchArchive');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'searchArchive', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - searchArchive');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function listArchive(req, res) {
    try {
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - listArchive');
        const files = getAllMp3FilesInArchive()
        return res.status(200).send(files);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby wypisania plików w archiwum', 'LocalAPI - listArchive');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'listArchive', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - listArchive');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function queryArchive(req, res) {
    try {
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - queryArchive');
        const query = await archiveSongsQuery();
        return res.status(200).send(query);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zapytania archiwum', 'LocalAPI - queryArchive');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'queryArchive', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - queryArchive');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function deleteArchiveFile(req, res) {
    try {
        const filename = req.query.filename;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - deleteArchiveFile');
        if (!filename) {
            return res.status(400).send('Nie podano nazwy pliku!');
        }
        const secuCheck = pathSecurityChecker(filename, archdir);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba usunięcia pliku z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - deleteArchiveFile');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        const result = deleteFromArchive(filename);
        if (result.error) {
            return res.status(500).send(result);
        }
        return res.status(200).json(result);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby usunięcia pliku z archiwum', 'LocalAPI - deleteArchiveFile');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'deleteArchiveFile', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - deleteArchiveFile');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function getArchiveFolders(req, res) {
    try {
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - getArchiveFolders');
        const folders = getArchiveSubfolders();
        return res.status(200).json(folders);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas pobierania podkatalogów archiwum', 'LocalAPI - getArchiveFolders');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'getArchiveFolders', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - getArchiveFolders');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function copyFileToPlaylist(req, res) {
    try {
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - copyFileToPlaylist');
        const { file, playlistId } = req.body;
        if (!file) return res.status(400).send('Nie podano nazwy pliku!');
        if (!playlistId) return res.status(400).send('Nie podano ID playlisty!');

        // zabezpieczenie ścieżki względem katalogu archiwum
        const secuCheck = pathSecurityChecker(file, archdir);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba kopiowania z archiwum z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - copyFileToPlaylist');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }

        const playlistPath = playlistId.toString().replace(/^\/+|\/+$/g, '');

        const targetDir = path.join('./mp3', playlistPath);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        const basename = path.basename(file);
        const destPath = path.join(targetDir, basename);

        if (fs.existsSync(destPath)) {
            return res.status(200).json({ message: `Plik już istnieje: ${basename}` });
        }

        const result = copyFromArchive(file, destPath);
        return res.status(200).json({ message: result });
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas kopiowania pliku z archiwum do playlisty', 'LocalAPI - copyFileToPlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'copyFileToPlaylist', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - copyFileToPlaylist');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e.message);
    }
}

export async function checkCopyFromArchive(req, res) {
    try {
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - checkCopyFromArchive');
        const { subfolderName, clearFolder } = req.body;
        
        if (!subfolderName) {
            return res.status(400).send('Nie podano nazwy podkatalogu!');
        }
        const secuCheck = pathSecurityChecker(subfolderName, archdir);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba kopiowania z archiwum z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - checkCopyFromArchive');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        const result = copyFromArchiveToSix(subfolderName, clearFolder || false);
        return res.status(200).json(result);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas kopiowania z archiwum', 'LocalAPI - checkCopyFromArchive');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'checkCopyFromArchive', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - checkCopyFromArchive');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e.message);
    }
}

export async function movePlaylist(req, res) {
    try {
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - movePlaylist');
        const playlistId = parseInt(req.body.playlistId);
        const userNotice = req.body.userNotice?.toString() || null;
        const secuCheck = pathSecurityChecker(playlistId.toString(), archdir);
        if (Number.isNaN(playlistId)) {
             return res.status(400).send('Nieprawidłowy ID playlisty!');
        }
        if (getPlaylistName(playlistId) === playlistId) {
            return res.status(400).send('Nieprawidłowy ID playlisty!');
        }
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba przenoszenia playlisty do archiwum z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - movePlaylist');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }     
        const result = await movePlaylistToArchive(playlistId, userNotice);
        if (typeof result === 'string') {
            return res.status(400).send(result);
        }
        return res.status(200).json(result);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas przenoszenia playlisty do archiwum', 'LocalAPI - movePlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'movePlaylist', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - movePlaylist');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e.message);
    }
}

