import * as fs from "fs";
import {logger} from "./Logger.js";

const archdir = process.env.ARCHIVE_DIR || './mp3/Archive';

function initArchive() {
    if(!fs.existsSync(archdir)) {
        logger('warn', 'Katalog archiwum nie istnieje, tworzenie katalogu…', 'ArchiveModule');
        fs.mkdirSync(archdir, { recursive: true });
        return initArchive();
    }
    const fullPath = fs.realpathSync(archdir);
    logger('log', 'Wczytywanie Archiwum…', 'ArchiveModule');
    logger('verbose', `Archiwum znajduje się w: '${fullPath}'`, 'ArchiveModule');
    const files = fs.readdirSync(archdir);
    if (files.length === 0) {
        logger('warn', 'Archiwum jest puste :c', 'ArchiveModule');
    } else {
        logger('log', `Archiwum posiada: ${files.length} plików`, 'ArchiveModule');
    }
}

function copyToArchive(path) {
    if (fs.statSync(path).isFile()) {
        const file = path.split('/').pop();
        const destPath = `${archdir}/${file}`;
        if(fs.existsSync(destPath)) return logger('log', `Plik ${path} istnieje w archiwum.`, 'ArchiveModule - copyToArchive');
        fs.copyFileSync(path, destPath);
        logger('log', `Skopiowano plik ${path} do archiwum.`, 'ArchiveModule - copyToArchive');
        return;
    }
    const files = fs.readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        if (fs.statSync(filePath).isFile()) {
            const destPath = `${archdir}/${file}`;
            if(fs.existsSync(destPath)) return logger('log', `Plik ${file} istnieje w archiwum.`, 'ArchiveModule - copyToArchive');
            fs.copyFileSync(filePath, destPath);
            logger('log', `Skopiowano plik ${file} do archiwum.`, 'ArchiveModule - copyToArchive');
        } else {
            logger('warn', `Nie można skopiować ${file}, ponieważ nie jest to plik.`, 'ArchiveModule - copyToArchive');
        }
    });
}

function copyFromArchive(file, destPath) {
    const srcPath = `${archdir}/${file}`;
    if (!fs.existsSync(srcPath)) return logger('error', `Plik ${file} nie istnieje w archiwum.`, 'ArchiveModule - copyFromArchive');
    fs.copyFileSync(srcPath, destPath);
    return logger('log', `Skopiowano plik ${file} z archiwum do ${destPath}.`, 'ArchiveModule - copyFromArchive');
}

function checkIfFileExistsInArchive(file) {
    const filePath = `${archdir}/${file}`;
    // console.log(file, filePath)
    if (fs.existsSync(filePath)) {
        logger('log', `Plik ${file} istnieje w archiwum.`, 'ArchiveModule - checkIfFileExistsInArchive');
        return true;
    } else {
        logger('log', `Plik ${file} nie istnieje w archiwum.`, 'ArchiveModule - checkIfFileExistsInArchive');
        return false;
    }
}

export { initArchive, copyToArchive, copyFromArchive, checkIfFileExistsInArchive };