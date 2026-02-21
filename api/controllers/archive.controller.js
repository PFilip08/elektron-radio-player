import {logger} from "../../modules/Logger.js";
import {sterylizatorIP} from "../../modules/Other.js";
import {pathSecurityChecker} from "../../modules/Other.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {getPlaylistName} from "../../modules/MusicPlayer.js";
import {searchInArchive, getAllMp3FilesInArchive, archiveSongsQuery, deleteFromArchive, getArchiveSubfolders, copyFromArchiveToSix, copyPlaylistToArchive, archdir} from "../../modules/ArchiveModule.js";

export async function searchArchive(req, res) {
    try {
        const file = req.query.file;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - searchArchive');
        if (!file) {
            return res.status(400).send('Nie podano nazwy pliku!');
        }
        let secuCheck = pathSecurityChecker(file, archdir);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba wyszukania pliku po za archiwum! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - searchArchive');
            return res.status(403).send('Niebezpieczna ścieżka!');
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
        let secuCheck = pathSecurityChecker(filename, archdir);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba usunięcia pliku z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - deleteArchiveFile');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        const result = deleteFromArchive(filename);
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

export async function copyPlaylist(req, res) {
    try {
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - copyPlaylist');
        const playlistId = parseInt(req.body.playlistId);
        let secuCheck = pathSecurityChecker(playlistId.toString(), archdir);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba kopiowania playlisty do archiwum z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - copyPlaylist');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        
        if (getPlaylistName(playlistId) === playlistId) {
            return res.status(400).send('Nieprawidłowy ID playlisty!');
        }
        
        const result = await copyPlaylistToArchive(playlistId);
        if (result.includes('jest pusta')) {
            return res.status(400).send(result);
        }
        return res.status(200).json(result);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas kopiowania playlisty do archiwum', 'LocalAPI - copyPlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'copyPlaylist', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - copyPlaylist');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e.message);
    }
}

