import {Spotify} from "@zaptyp/spotifydl-core";
import Ffmpeg from 'fluent-ffmpeg'
import * as fs from "fs";
import {logger} from "./Logger.js";
import * as path from "path";
import {sterylizator, truncate} from "./Other.js";
import {DebugSaveToFile} from "./DebugMode.js";
import os from "os";
import axios from "axios";
import {exec} from "child_process";
import YTDlpWrap from 'yt-dlp-core';
import {checkIfFileExistsInArchive, copyFromArchive, copyToArchive} from "./ArchiveModule.js";

async function downloader(url, votes, path) {
    const urlParts = url.split('?')[0].split("/");
    const type = urlParts[3];
    logger('verbose', `Wynik splita: ${urlParts}`, 'downloader');
    logger('verbose', `Wykryto: ${urlParts[3]}`, 'downloader');
    // możliwe
    switch (type) {
        case 'track':
            logger('log', 'Wykryto piosenkę', 'downloader');
            return downloadSong(url, votes, path);
        case 'album':
            logger('log', 'Wykryto album', 'downloader');
            return downloadAlbum(url, path);
        case 'playlist':
            logger('log', 'Wykryto playlistę', 'downloader');
            return downloadPlaylist(url, path);
        case 'watch':
            logger('log', 'Wykryto link YT', 'downloader');
            return downloadYT(url, votes, path);
        default:
            return handleDefaultCase(url, votes);
    }
}

function handleDefaultCase(url, votes) {
    if (votes) {
        logger('verbose', 'Wykryto próbę pobrania nieautoryzowanego typu linku w głosach!', 'handleDefaultCase');
        logger('warn', 'Coś przeciekło', 'handleDefaultCase');
        url='https://open.spotify.com/track/5Wrl4uc9SjC8ZnAimiMtys'; // No przekorny los, bo przeciekło
        return downloadSong(url, votes);
    }
    logger('warn', 'Nie wykryto typu linku!', 'handleDefaultCase');
    if (global.debugmode === true) {
        DebugSaveToFile('MusicDownloader', 'handleDefaultCase', 'catched_link', url);
        logger('verbose', `Zapisano link do debug/`, 'handleDefaultCase');
    }
    return 'Nie wykryto typu linku!';
}

async function downloadSong(url, votes, path2) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    try {
        let path = path2 || `./mp3/onDemand/`;
        const data = await spotify.getTrack(url);
        const file = truncate(sterylizator(data.artists.join('-') + '_' + data.name), 200);
        logger('log', `Pobieram: ${data.name + ' by: ' + data.artists.join(', ')}`, 'downloadSong');
        logger('verbose', 'Sprawdzanie czy nie pobieram z głosów...', 'downloadSong');
        if (votes) {path = `./mp3/7/`; logger('verbose', 'Pobieranie z głosowania!', 'downloadSong');}
        if (fs.existsSync(`${path}${file}.mp3`)) { logger('warn', 'Plik istnieje!', 'downloadSong'); return 'Pobrano! OwO - znaczy qwq, plik istnieje'; }
        if(checkIfFileExistsInArchive(`${file}.mp3`)) {
            logger('warn', `Plik istnieje w archiwum!`, 'downloadSong');
            logger('log', 'Pobieranie z archiwum :>', 'downloadSong');
            return copyFromArchive(`${file}.mp3`, `${path}${file}.mp3`);
        }
        const song = await spotify.downloadTrack(url);
        fs.writeFileSync(`${path}${file}.mp3`, song);
        logger('verbose', 'Normalizacja dźwięku przy użyciu mp3gain...', 'downloadSong');
        await new Promise((resolve, reject) => exec(`mp3gain -r -c ${path}${file}.mp3`, (error, stdout) => (logger('verbose', `\n${stdout}`, 'downloadSong'), global.debugmode && (DebugSaveToFile('MusicDownloader', 'downloadSong', 'mp3gain_output', stdout), logger('verbose', `Zapisano do debug/`, 'downloadSong')), error ? (logger('error', `Błąd podczas próby normalizacji dźwięku przy użyciu mp3gain: ${error.message}`, 'downloadSong'), global.debugmode && (DebugSaveToFile('MusicDownloader', 'downloadSong', 'mp3gain_error', error), logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadSong')), reject(error)) : resolve(stdout))));
        copyToArchive(`${path}${file}.mp3`);
        logger('log', 'Pobrano :>', 'downloadSong');
        return "Pobrano! OwO";
    } catch (e) {
        logger('error', "Błąd w trakcie wykonywania funkcji downloadSong", 'downloadSong');
        logger('error', e, 'downloadSong');
        if (global.debugmode === true) {
            DebugSaveToFile('MusicDownloader', 'downloadSong', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadSong');
        }
    }
}

async function downloadPlaylist(url, path2) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    try {
        const path = path2 || `./mp3/onDemand/`;
        try {
            const data = await spotify.getPlaylist(url);
        } catch (e) {
            if (e.message.includes('owned by the current user')) {
                logger('error', 'Spotify sie zesrało i nie pobierzesz playlisty której nie jesteś autorem ani nie jesteś współwłaścicielem :<', 'downloadPlaylist');
                return 'Spotify sie zesrało i nie pobierzesz playlisty której nie jesteś autorem ani nie jesteś współwłaścicielem :<';
            }
        }
        for (let i in data.tracks) {
            let song = await getTrackInfo(data.tracks[i]);
            logger('log', `Pobieranie: ${song.name + ' by: ' + song.artists.join(', ')}`, 'downloadPlaylist');
        }
        const playlist = await spotify.downloadPlaylist(url)
        for (let i in playlist) {
            let song = await getTrackInfo(data.tracks[i]);
            const dir = sterylizator(data.name);
            if (!fs.existsSync(`${path}${dir}`)) {
                fs.mkdirSync(`${path}${dir}`);
            }
            const file = truncate(sterylizator(song.artists.join('-') + '_' + song.name), 200);
            if (fs.existsSync(`${path}${dir}/${file}.mp3`)) {
                logger('warn', `${file}.mp3 - Plik istnieje!`, 'downloadPlaylist');
                continue;
            }
            if(checkIfFileExistsInArchive(`${file}.mp3`)) {
                logger('warn', `Plik istnieje w archiwum!`, 'downloadPlaylist');
                logger('log', 'Pobieranie z archiwum :>', 'downloadPlaylist');
                copyFromArchive(`${file}.mp3`, `${path}${dir}/${file}.mp3`);
                continue;
            }
            fs.writeFileSync(`${path}${dir}/${file}.mp3`, playlist[i]);
            await new Promise((resolve, reject) => exec(`mp3gain -r -c ${path}${dir}/${file}.mp3`, (error, stdout) => (logger('verbose', `\n${stdout}`, 'downloadPlaylist'), global.debugmode && (DebugSaveToFile('MusicDownloader', 'downloadPlaylist', 'mp3gain_output', stdout), logger('verbose', `Zapisano do debug/`, 'downloadPlaylist')), error ? (logger('error', `Błąd podczas próby normalizacji dźwięku przy użyciu mp3gain: ${error.message}`, 'downloadPlaylist'), global.debugmode && (DebugSaveToFile('MusicDownloader', 'downloadPlaylist', 'mp3gain_error', error), logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadPlaylist')), reject(error)) : resolve(stdout))));
            copyToArchive(`${path}${dir}/${file}.mp3`);
        }
        logger('log', 'Pobrano :>', 'downloadPlaylist');
        return "Pobrano! OwO";
    } catch (e) {
        logger('error', "Błąd w trakcie wykonywania funkcji downloadPlaylist", 'downloadPlaylist');
        logger('error', e, 'downloadPlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('MusicDownloader', 'downloadPlaylist', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadPlaylist');
        }
    }
}

async function downloadAlbum(url, path2) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    try {
        const path = path2 || `./mp3/onDemand/`;
        const data = await spotify.getAlbum(url);
        const dir = sterylizator(data.name);
        if (!fs.existsSync(`${path}${dir}`)) {
            fs.mkdirSync(`${path}${dir}`);
        }
        for (let i in data.tracks) {
            let song = await getTrackInfo(data.tracks[i]);
            logger('log', `Pobieranie: ${song.name + ' by: ' + song.artists.join(', ')}`, 'downloadAlbum');
        }
        const album = await spotify.downloadAlbum(url);
        for (let i in album) {
            let song = await getTrackInfo(data.tracks[i]);
            const file = truncate(sterylizator(song.artists.join('-') + '_' + song.name), 200);
            if (fs.existsSync(`${path}${dir}/${file}.mp3`)) {
                logger('warn', `${file}.mp3 - Plik istnieje!`, 'downloadAlbum');
                continue;
            }
            if(checkIfFileExistsInArchive(`${file}.mp3`)) {
                logger('warn', `Plik istnieje w archiwum!`, 'downloadAlbum');
                logger('log', 'Pobieranie z archiwum :>', 'downloadAlbum');
                copyFromArchive(`${file}.mp3`, `${path}${dir}/${file}.mp3`);
                continue;
            }
            fs.writeFileSync(`${path}${dir}/${file}.mp3`, album[i]);
            await new Promise((resolve, reject) => exec(`mp3gain -r -c ${path}${dir}/${file}.mp3`, (error, stdout) => (logger('verbose', `\n${stdout}`, 'downloadAlbum'), global.debugmode && (DebugSaveToFile('MusicDownloader', 'downloadAlbum', 'mp3gain_output', stdout), logger('verbose', `Zapisano do debug/`, 'downloadAlbum')), error ? (logger('error', `Błąd podczas próby normalizacji dźwięku przy użyciu mp3gain: ${error.message}`, 'downloadAlbum'), global.debugmode && (DebugSaveToFile('MusicDownloader', 'downloadAlbum', 'mp3gain_error', error), logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadAlbum')), reject(error)) : resolve(stdout))));
            copyToArchive(`${path}${dir}/${file}.mp3`);
        }
        logger('log', 'Pobrano :>', 'downloadAlbum');
        return "Pobrano! OwO";
    } catch (e) {
        logger('error', "Błąd w trakcie wykonywania funkcji downloadAlbum", 'downloadAlbum');
        logger('error', e, 'downloadAlbum');
        if (global.debugmode === true) {
            DebugSaveToFile('MusicDownloader', 'downloadAlbum', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadAlbum');
        }
    }
}

async function getTrackInfo(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    try {
    const urlParts = url.split("/");
    logger('verbose', `Wynik splita: ${urlParts}`, 'getTrackInfo');
    logger('verbose', `Wykryto: ${urlParts[3]}`, 'getTrackInfo');
    if (url.includes("youtube.com/watch?v=")) {
        logger('log', 'Wykryto link YT', 'getTrackInfo');
        const ytdlp = new YTDlpWrap();
        const taboret = await ytdlp.getBasicInfo(url);
        const trackInfo = {
            name: taboret.videoDetails.title,
            artists: [taboret.videoDetails.author.name + "_-" || "Unknown Artist"],
        };
        return trackInfo;
    }
    switch (urlParts[3]) {
        case 'album':
            logger('log', 'Wykryto album', 'getTrackInfo');
            return await spotify.getAlbum(url);
        case 'playlist':
            logger('log', 'Wykryto playlistę', 'getTrackInfo');
            return await spotify.getPlaylist(url);
        case 'track':
            logger('log', 'Wykryto piosenkę', 'getTrackInfo');
            return await spotify.getTrack(url);
        default:
            logger('warn', 'Nie wykryto typu linku!', 'getTrackInfo');
            if (global.debugmode === true) {
                DebugSaveToFile('MusicDownloader', 'getTrackInfo', 'catched_link', url);
                logger('verbose', `Zapisano link do debug/`, 'getTrackInfo');
            }
            return 'Nie wykryto typu linku!';
    }
    } catch (e) {
        logger('error', "Błąd w trakcie wykonywania funkcji getTrackInfo", 'getTrackInfo');
        logger('error', e, 'getTrackInfo');
        if (global.debugmode === true) {
            DebugSaveToFile('MusicDownloader', 'getTrackInfo', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'getTrackInfo');
        }
    }
}

async function getYTInfo(url) {
    if (!url) return 'Brak URL!!11';
    const ytdlpDown = new YTDlpWrap();
    const song = await ytdlpDown.getBasicInfo(url);
    const description = song.videoDetails.description.toLowerCase();
    const title = song.videoDetails.title.toLowerCase();
    const file = truncate(sterylizator(song.videoDetails.author.name+' - '+song.videoDetails.title), 200);
    return {song, description, title, file};
}

async function downloadYT(url, votes, path2, override) {
    try {
        let Path = path2 || `./mp3/onDemand/`;
        if (votes) Path = './mp3/7/';
        const ytdlpDown = new YTDlpWrap();
        const info = await getYTInfo(url);
        const song = info.song;
        const description = info.description;
        const title = info.title;
        const musicKeywords = ['official music video', 'lyrics', 'audio', 'album', 'song', 'spotify', 'tidal', 'muzyka', 'muzy', 'muza', 'płytę', 'feat', 'remastered', 'vevo', 'mix', 'nightcore', 'hardstyle', 'sony music entertainment', 'bmg rights management', 'warner music group company', 'piosenka', 'piosenek'];
        if (!override) {
            if (song.videoDetails.category[0] !== 'Music') {
                if (song.videoDetails.category[0] === 'Entertainment') {
                    logger('log', `KATEGORIA ENTERTAINMENT!`, 'downloadYT');
                } else if (song.videoDetails.category[0] === 'Gaming') {
                    logger('log', `KATEGORIA GEJMING!`, 'downloadYT');
                } else if (song.videoDetails.category[0] === undefined) {
                    logger('warn', `KATEGORIA CHUJ WIE CO (undefined)`, 'downloadYT');
                }
                // if (song.videoDetails.category[0] !== 'Entertainment') {
                //     logger('warn', `Nie jest to kategoria Music ani Entertainment! Wykryto: ${song.videoDetails.category[0]}`, 'downloadYT');
                //     //return `Nie można pobrać bo nie jest to kategoria Music/Entertainment! Tylko: ${song.videoDetails.category[0]} jedyne co możesz zrobić to poprosić szanownego Pana admina aby dodał do tego wyjątek.`;
                // }
                if (musicKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
                    if (song.videoDetails.lengthSeconds > 600) {
                        logger('warn', `To jest film, nie piosenka, bo jest zbyt długa!`, 'downloadYT');
                        return 'Nie można pobrać bo to jest film';
                    }
                    logger('log', `Wykryto, że to piosenka z kategorii Entertainment!`, 'downloadYT');
                } else {
                    logger('warn', `Nie wykryto słów kluczowych aby rozpoznać, czy jest to piosenka!`, 'downloadYT');
                    return 'Nie można pobrać bo nie wykryto słów kluczowych w opisie';
                }
            }
        } else logger('log', `Pomijanie regexa wykrywania!`, 'downloadYT');

        const file = info.file;
        const filePath = `${Path}${file}.mp3`;
        logger('log', `Pobieram: ${info.song.videoDetails.title + ' by: ' +info.song.videoDetails.author.name}`, 'downloadYT');
        if (fs.existsSync(filePath)) {logger('warn', `Plik istnieje!`, 'downloadYT');return 'Pobrano! OwO - znaczy qwq, plik istnieje'; }
        if(checkIfFileExistsInArchive(`${file}.mp3`)) {
            logger('warn', `Plik istnieje w archiwum!`, 'downloadYT');
            logger('log', 'Pobieranie z archiwum :>', 'downloadYT');
            return copyFromArchive(`${file}.mp3`, filePath);
        }
        //No playlist po to bo jak ktoś wrzuci link do filmu z yt z dodatkiem query list to ytdlp domyślnym zachowaniem pobierze całą playlistę... Jaki idiota to programował?
        let stream = ytdlpDown.execStream([url, '-f', 'ba', '-x', '--no-playlist']);

        const tempFilePath = path.resolve(`${os.tmpdir()}/${file}.webm`);
        const outputFilePath = path.resolve(`${Path}${file}.mp3`);
        // console.log(votes, outputFilePath, filePath);

        const tempFileStream = fs.createWriteStream(tempFilePath);
        stream.pipe(tempFileStream);
        tempFileStream.on('error', (err) => {
            logger('error', `Błąd podczas zapisywania pliku tymczasowego: ${err.message}`, 'downloadYT');
            logger('verbose', `Sprzątam pierdolnik po błędzie`, 'downloadYT');
            fs.unlinkSync(tempFilePath);
            if (global.debugmode === true) {
                DebugSaveToFile('MusicDownloader', 'downloadYT', 'error_tempfile_save', err);
                logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadYT');
            }
        });
        await new Promise((resolve, reject) => {
            try {
                tempFileStream.on('finish', async () => {
                    logger('log', `Dodawanie metadanych dla pliku: ${song.videoDetails.title}`, 'downloadYT');
        
                    const metadata = {
                        title: song.videoDetails.title,
                        artist: song.videoDetails.author.name,
                        album: song.videoDetails.media ? song.videoDetails.media.artist : '',
                        genre: song.videoDetails.category,
                        date: song.videoDetails.publishDate
                    };
                    const response = await axios.get(song.videoDetails.thumbnails[3].url, { responseType: 'arraybuffer' });
                    fs.writeFileSync(`${os.tmpdir()}/${file}.jpg`, response.data);
                    const outputOptions = ['-map', '0:0', '-map', '1',];
                    Object.keys(metadata).forEach((key) => {
                        if (metadata[key]) {
                            outputOptions.push('-metadata', `${String(key)}=${metadata[key]}`);
                        }
                    });
        
                    Ffmpeg()
                        .input(tempFilePath)
                        .input(`${os.tmpdir()}/${file}.jpg`)
                        .on('end', () => {
                            logger('log', `Metadane dodane pomyślnie! Plik zapisany jako: ${outputFilePath}`, 'downloadYT');
                            logger('verbose', `Usuwam pliki tymczasowe: ${tempFilePath}`, 'downloadYT');
                            fs.unlinkSync(tempFilePath);
                            fs.unlinkSync(`${os.tmpdir()}/${file}.jpg`);
                            resolve();
                        })
                        .on('error', (err) => {
                            logger('error', `Błąd podczas dodawania metadanych: ${err.message}`, 'downloadYT');
                            logger('verbose', `Sprzątam pierdolnik po błędzie`, 'downloadYT');
                            fs.unlinkSync(tempFilePath);
                            fs.unlinkSync(`${os.tmpdir()}/${file}.jpg`);
                            if (global.debugmode === true) {
                                DebugSaveToFile('MusicDownloader', 'downloadYT', 'error_metadata', err);
                                logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadYT');
                            }
                            reject();
                        })
                        .addOutputOptions(...outputOptions)
                        .saveToFile(outputFilePath);
                });
            } catch (e) {
                logger('error', `Błąd podczas dodawania metadanych: ${e.message}`, 'downloadYT');
                fs.unlinkSync(tempFilePath);
                fs.unlinkSync(`${os.tmpdir()}/${file}.jpg`);
                if (global.debugmode === true) {
                    DebugSaveToFile('MusicDownloader', 'downloadYT', 'error', e);
                    logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadYT');
                }
                reject();
            }
        });
        logger('log', `Normalizacja dźwięku w pliku ${outputFilePath} przy użyciu mp3gain...`, 'downloadYT');
        await new Promise((resolve, reject) => {
            exec(`mp3gain -r -c ${filePath}`, (error, stdout, stderr) => {
                logger('verbose', "\n"+ stdout, 'downloadYT')
                if (global.debugmode === true) {
                    DebugSaveToFile('MusicDownloader', 'downloadYT', 'mp3gain_output', stdout);
                    logger('verbose', `Zapisano do debug/`, 'downloadYT');
                }
                if (error) {
                    logger('error', `Błąd podczas próby normalizacji dźwięku przy użyciu mp3gain: ${error.message}`, 'downloadYT');
                    if (global.debugmode === true) {
                        DebugSaveToFile('MusicDownloader', 'downloadYT', 'mp3gain_error', error);
                        logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadYT');
                    }
                    reject(error);
                }
                resolve(stdout);
            });
        });
        copyToArchive(filePath);
        logger('log', 'Pobrano :>', 'downloadYT');
        return "Pobrano! OwO"

    } catch (e) {
        logger('error', "Błąd w trakcie wykonywania funkcji downloadYT", 'downloadYT');
        logger('error', e, 'downloadYT');
        if (global.debugmode === true) {
            DebugSaveToFile('MusicDownloader', 'downloadYT', 'error_main_function', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadYT');
        }
    }
}
async function autoRemoveFiles() {
    fs.readdir('./mp3/onDemand', (err, files) => {
        if (err) return logger('error '+err,'autoRemoveFiles');
        if (files.length === 0) return logger('task','Brak plików do usunięcia.','autoRemoveFiles');
        for (let i in files) {
            if (fs.lstatSync('./mp3/onDemand/'+files[i]).isDirectory()) {
                logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'autoRemoveFiles');
                fs.rmSync('./mp3/onDemand/'+files[i], { recursive: true, force: true })
                continue;
            }
            fs.unlinkSync(path.join('./mp3/onDemand', files[i]));
            logger('task', `Usunięto ${files[i]}`, 'autoRemoveFiles')
        }
    });
    fs.readdir('./mp3/7', (err, files) => {
        if (err) return logger('error '+err,'autoRemoveFiles');
        if (files.length === 0) return logger('task','Brak plików do usunięcia.','autoRemoveFiles');
        for (let i in files) {
            if (fs.lstatSync('./mp3/7/'+files[i]).isDirectory()) {
                logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'autoRemoveFiles');
                fs.rmSync('./mp3/7/'+files[i], { recursive: true, force: true });
                continue;
            }
            fs.unlinkSync(path.join('./mp3/7', files[i]));
            logger('task', `Usunięto ${files[i]}`, 'autoRemoveFiles');
        }
    });
}

async function removeFiles(pathDir) {
    if (pathDir.length < 6 && /\/[1-7](\/|$)/.test(pathDir)) return 'dupa';
    fs.readdir(pathDir, (err, files) => {
        if (err) return logger('error '+err,'removeFiles');
        if (files.length === 0) return logger('task','Brak plików do usunięcia.','removeFiles');
        for (let i in files) {
            if (fs.lstatSync(pathDir+files[i]).isDirectory()) {
                logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'removeFiles');
                fs.rmSync(pathDir+files[i], { recursive: true, force: true })
                continue;
            }
            fs.unlinkSync(path.join(pathDir, files[i]));
            logger('task', `Usunięto ${files[i]}`, 'removeFiles');
        }
    });
}

export { downloader, downloadPlaylist, downloadAlbum, getTrackInfo, autoRemoveFiles, downloadYT, removeFiles, getYTInfo };