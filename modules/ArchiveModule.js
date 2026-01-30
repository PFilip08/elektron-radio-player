import * as fs from "fs";
import {logger} from "./Logger.js";
import { parseFile } from "music-metadata";
import * as path from "node:path";
import { yellow } from "colorette";

const archdir = process.env.ARCHIVE_DIR || './mp3/Archive';

function initArchive() {
    logger('verbose', `Sprawdzanie czy katalog archiwum istnieje: ${archdir}`, 'initArchive');
    if(!fs.existsSync(archdir)) {
        logger('warn', 'Katalog archiwum nie istnieje, tworzenie katalogu…', 'initArchive');
        logger('verbose', 'Tworzenie katalogu archiwum z recursive: true', 'initArchive');
        fs.mkdirSync(archdir, { recursive: true });
        logger('verbose', 'Dzwonienie do initArchive po utworzeniu katalogu', 'initArchive');
        return initArchive();
    }
    logger('verbose', 'Katalog archiwum istnieje, pobieranie pełnej ścieżki', 'initArchive');
    const fullPath = fs.realpathSync(archdir);
    logger('log', 'Wczytywanie Archiwum…', 'initArchive');
    logger('verbose', `Archiwum znajduje się w: '${fullPath}'`, 'initArchive');
    logger('verbose', 'Odczytywanie plików w katalogu archiwum', 'initArchive');
    const files = fs.readdirSync(archdir);
    logger('verbose', `Znaleziono ${files.length} plików w archiwum`, 'initArchive');
    if (files.length === 0) {
        logger('warn', 'Archiwum jest puste :c', 'initArchive');
    } else {
        logger('log', `Archiwum posiada: ${files.length} plików`, 'initArchive');
    }
}

function copyToArchive(path) {
    logger('verbose', 'Sprawdzanie czy podana ścieżka jest plikiem', 'copyToArchive');
    if (fs.statSync(path).isFile()) {
        logger('verbose', 'Ścieżka jest plikiem, kopiowanie pojedynczego pliku', 'copyToArchive');
        const file = path.split('/').pop();
        const destPath = `${archdir}/${file}`;
        logger('verbose', `Sprawdzanie czy plik ${file} już istnieje w archiwum`, 'copyToArchive');
        if(fs.existsSync(destPath)) return logger('log', `Plik ${path} istnieje w archiwum.`, 'copyToArchive');
        logger('verbose', `Kopiowanie pliku ${file} do archiwum`, 'copyToArchive');
        fs.copyFileSync(path, destPath);
        logger('log', `Skopiowano plik ${path} do archiwum.`, 'copyToArchive');
        return;
    }
    logger('verbose', 'Ścieżka jest katalogiem, odczytywanie plików', 'copyToArchive');
    const files = fs.readdirSync(path);
    logger('verbose', `Znaleziono ${files.length} plików w katalogu`, 'copyToArchive');
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        logger('verbose', `Przetwarzanie pliku: ${file}`, 'copyToArchive');
        if (fs.statSync(filePath).isFile()) {
            const destPath = `${archdir}/${file}`;
            logger('verbose', `Sprawdzanie czy ${file} już istnieje w archiwum`, 'copyToArchive');
            if(fs.existsSync(destPath)) return logger('log', `Plik ${file} istnieje w archiwum.`, 'copyToArchive');
            logger('verbose', `Kopiowanie ${file} do archiwum`, 'copyToArchive');
            fs.copyFileSync(filePath, destPath);
            logger('log', `Skopiowano plik ${file} do archiwum.`, 'copyToArchive');
        } else {
            logger('warn', `Nie można skopiować ${file}, ponieważ nie jest to plik.`, 'copyToArchive');
        }
    });
}

function copyFromArchive(file, destPath) {
    const srcPath = `${archdir}/${file}`;
    logger('verbose', `Sprawdzanie czy plik istnieje w archiwum: ${srcPath}`, 'copyFromArchive');
    if (!fs.existsSync(srcPath)) return logger('error', `Plik ${file} nie istnieje w archiwum.`, 'copyFromArchive');
    logger('verbose', `Kopiowanie pliku z ${srcPath} do ${destPath}`, 'copyFromArchive');
    fs.copyFileSync(srcPath, destPath);
    logger('log', `Skopiowano plik ${file} z archiwum do ${destPath}.`, 'copyFromArchive');
    return `Skopiowano/Pobrano plik ${file} z archiwum do ${destPath}.`;
}

function checkIfFileExistsInArchive(file) {
    logger('verbose', `Sprawdzanie czy plik istnieje w archiwum: ${file}`, 'checkIfFileExistsInArchive');
    const filePath = `${archdir}/${file}`;
    logger('verbose', `Pełna ścieżka do sprawdzenia: ${filePath}`, 'checkIfFileExistsInArchive');
    if (fs.existsSync(filePath)) {
        logger('log', `Plik ${file} istnieje w archiwum.`, 'checkIfFileExistsInArchive');
        return true;
    } else {
        logger('log', `Plik ${file} nie istnieje w archiwum.`, 'checkIfFileExistsInArchive');
        return false;
    }
}

async function archiveSongsQuery() {
    const getMetadata = async (filePath) => {
        logger('verbose', `Pobieranie metadanych dla: ${filePath}`, 'archiveSongsQuery');
        try {
            const metadata = await parseFile(filePath);
            const title = metadata.common.title || path.basename(filePath, path.extname(filePath));
            const artist = metadata.common.artist || 'Nieznany Artysta';
            const duration = metadata.format.duration || 0;
            logger('verbose', `Pobrano metadane: ${title} - ${artist}`, 'archiveSongsQuery');
            return { title, artist, duration, filePath };
        } catch (error) {
            logger('error', `Wystąpił błąd podczas próby odczytania metadanych z pliku ${filePath}`, 'archiveSongsQuery');
            if (global.debugmode === true) {
                DebugSaveToFile('ArchiveModule', 'archiveSongsQuery', 'catched_error', error);
                logger('verbose',`Stacktrace został zrzucony do /debug`,'archiveSongsQuery');    
            }
            return { title: path.basename(filePath, path.extname(filePath)), artist: 'Nieznany Artysta', duration: 0, filePath};
        }
    };
    logger('verbose', 'Pobieranie wszystkich plików MP3 z archiwum', 'archiveSongsQuery');
    const allMp3Files = getAllMp3FilesInArchive();
    logger('verbose', `Znaleziono ${allMp3Files.length} plików MP3`, 'archiveSongsQuery');
    logger('verbose', 'Tworzenie promises dla metadanych wszystkich plików', 'archiveSongsQuery');
    const metadataPromises = allMp3Files.map(filePath => {
        return getMetadata(filePath);
    });
    logger('verbose', 'Oczekiwanie na pobranie wszystkich metadanych', 'archiveSongsQuery');
    return Promise.all(metadataPromises);
}

function getAllMp3FilesInArchive() {
    let mp3Files = [];
    function scanDirectory(dir) {
        logger('verbose', `Skanowanie katalogu: ${dir}`, 'getAllMp3FilesInArchive');
        try {
            const items = fs.readdirSync(dir);
            logger('verbose', `Znaleziono ${items.length} elementów w katalogu`, 'getAllMp3FilesInArchive');
            for (const item of items) {
                const fullPath = `${dir}/${item}`;
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    logger('verbose', `${item} jest katalogiem, skanowanie rekurencyjne`, 'getAllMp3FilesInArchive');
                    scanDirectory(fullPath);
                } else if (stat.isFile() && item.endsWith('.mp3')) {
                    logger('verbose', `Znaleziono plik MP3: ${item}`, 'getAllMp3FilesInArchive');
                    mp3Files.push(fullPath);
                }
            }
        } catch (err) {
            logger('error', `Błąd podczas odczytu katalogu ${dir}: ${err.message}`, 'getAllMp3FilesInArchive');
            if (global.debugmode === true) {
                DebugSaveToFile('ArchiveModule', 'getAllMp3FilesInArchive', 'catched_error', err);
                logger('verbose',`Stacktrace został zrzucony do /debug`,'getAllMp3FilesInArchive');    
            }
        }
    }
    scanDirectory(archdir);
    return mp3Files;
}

async function searchInArchive(query/*, options = {}*/) {
    // const { caseSensitive = false, limit = null } = options;
    // logger('verbose', `Opcje wyszukiwania - caseSensitive: ${caseSensitive}, limit: ${limit}`, 'searchInArchive');
    if (!query || query.trim() === '') {
        logger('verbose', yellow('Puste zapytanie wyszukiwania!'), 'searchInArchive');
        return { metadataMatches: [], filenameMatches: [], all: [] };
    }
    logger('verbose', `Wyszukiwanie w archiwum: "${query}"`, 'searchInArchive');
    let searchQuery = query.toLowerCase();
    //Stworzyłem to aby było ale w sumie po co?
    // if (caseSensitive) {
    //     searchQuery = query;
    // } else {
    //     searchQuery = query.toLowerCase();
    // }
    logger('verbose', `Zapytanie wyszukiwania: "${searchQuery}"`, 'searchInArchive');
    const metadataMatches = [];
    const filenameMatches = [];
    try {
        logger('verbose', 'Sprawdzanie czy katalog archiwum istnieje', 'searchInArchive');
        if (!fs.existsSync(archdir)) {
            logger('warn', 'Katalog archiwum nie istnieje!', 'searchInArchive');
            logger('verbose', yellow('Zwracanie pustych wyników - brak katalogu'), 'searchInArchive');
            return { metadataMatches: [], filenameMatches: [], all: [] };
        }
        logger('verbose', 'Pobieranie listy wszystkich plików MP3', 'searchInArchive');
        const files = getAllMp3FilesInArchive();
        logger('verbose', `Rozpoczęcie przeszukiwania ${files.length} plików`, 'searchInArchive');
        for (const filePath of files) {
            logger('verbose', `Przetwarzanie pliku: ${filePath.split('/').pop()}`, 'searchInArchive');
            try {
                logger('verbose', `Parsowanie metadanych pliku`, 'searchInArchive');
                const metadata = await parseFile(filePath);
                const title = metadata.common.title || '';
                const artist = metadata.common.artist || '';
                const album = metadata.common.album || '';
                logger('verbose', `Metadane: ${title} - ${artist} (${album})`, 'searchInArchive');
                let metadataText = `${title} ${artist} ${album}`.toLowerCase();
                // if (caseSensitive) {
                //     metadataText = `${title} ${artist} ${album}`;
                // } else {
                //     metadataText = `${title} ${artist} ${album}`.toLowerCase();
                // }
                const resultObject = {
                    filename: filePath.split('/').pop(),
                    path: filePath,
                    title: title || path.basename(filePath, path.extname(filePath)),
                    artist: artist || 'Nieznany Artysta',
                    album: album,
                    duration: metadata.format.duration || 0,
                    format: metadata.format.container || 'mp3',
                };
                let matchedByMetadata = false;
                let matchedByFilename = false;
                logger('verbose', `Sprawdzanie dopasowania w metadanych`, 'searchInArchive');
                if (metadataText.trim() && metadataText.includes(searchQuery)) {
                    logger('verbose', `Znaleziono dopasowanie w metadanych!`, 'searchInArchive');
                    matchedByMetadata = true;
                    metadataMatches.push({ ...resultObject, matchType: 'metadata' });
                }
                logger('verbose', `Sprawdzanie dopasowania w nazwie pliku`, 'searchInArchive');
                const filename = filePath.split('/').pop().replace(/\.mp3$/i, '');
                const filenameText = /*caseSensitive ?*/ filename /*: filename.toLowerCase()*/;
                if (filenameText.includes(searchQuery)) {
                    logger('verbose', `Znaleziono dopasowanie w nazwie pliku!`, 'searchInArchive');
                    matchedByFilename = true;
                    if (!matchedByMetadata) {
                        filenameMatches.push({ ...resultObject, matchType: 'filename' });
                    }
                }
                // if (limit && (metadataMatches.length + filenameMatches.length) >= limit) {
                //     logger('verbose', `Osiągnięto limit wyników: ${limit}`, 'searchInArchive');
                //     break;
                // }
            } catch (err) {
                logger('error', `Nie można odczytać metadanych pliku ${filePath}: ${err.message}`, 'searchInArchive');
                if (global.debugmode === true) {
                    DebugSaveToFile('ArchiveModule', 'searchInArchive', 'catched_error', err);
                    logger('verbose',`Stacktrace został zrzucony do /debug`,'searchInArchive');    
                }
                logger('verbose', `Pomijanie pliku ${filePath.split('/').pop()} z powodu błędu`, 'searchInArchive');
            }
        }
        logger('verbose', `Przeszukiwanie zakończone`, 'searchInArchive');
        const allResults = [...metadataMatches, ...filenameMatches];
        logger('verbose', `Znaleziono ${allResults.length} wyników dla zapytania: "${query}"`, 'searchInArchive');
        logger('verbose', `Zwracanie wyników wyszukiwania`, 'searchInArchive');
        return { metadataMatches, filenameMatches, all: allResults};
    } catch (err) {
        logger('error', `Błąd podczas wyszukiwania w archiwum: ${err.message}`, 'searchInArchive');
        if (global.debugmode === true) {
            DebugSaveToFile('ArchiveModule', 'searchInArchive', 'catched_error', err);
            logger('verbose',`Stacktrace został zrzucony do /debug`,'searchInArchive');    
        }
        logger('verbose', `Zwracanie pustych wyników z powodu błędu`, 'searchInArchive');
        return { metadataMatches: [], filenameMatches: [], all: [] };
    }
}

function deleteFromArchive(filename) {
    const filePath = `${archdir}/${filename}`;
    logger('verbose', `Pełna ścieżka do usunięcia: ${filePath}`, 'deleteFromArchive');
    logger('verbose', `Sprawdzanie czy plik istnieje`, 'deleteFromArchive');
    if (!fs.existsSync(filePath)) {
        logger('error', `Plik ${filename} nie istnieje w archiwum.`, 'deleteFromArchive');
        logger('verbose', `Zwracanie błędu - plik nie istnieje`, 'deleteFromArchive');
        return { error: `Plik ${filename} nie istnieje w archiwum.` };
    }
    try {
        logger('verbose', `Plik istnieje, przystąpienie do usuwania`, 'deleteFromArchive');
        //fs.unlinkSync(filePath);
        logger('log', `Usunięto plik ${filename} z archiwum.`, 'deleteFromArchive');
        return { error: `Usunięto plik ${filename} z archiwum.` };
    } catch (err) {
        logger('error', `Błąd podczas usuwania pliku ${filename}: ${err.message}`, 'deleteFromArchive');
        if (global.debugmode === true) {
            DebugSaveToFile('ArchiveModule', 'deleteFromArchive', 'catched_error', err);
            logger('verbose',`Stacktrace został zrzucony do /debug`,'deleteFromArchive');    
        }
        return { error: `Błąd podczas usuwania: ${err.message}` };
    }
}

export { initArchive, copyToArchive, copyFromArchive, checkIfFileExistsInArchive, searchInArchive, getAllMp3FilesInArchive, archiveSongsQuery, deleteFromArchive };