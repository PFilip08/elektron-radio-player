import {Spotify} from "spotifydl-core";
import Ffmpeg from 'fluent-ffmpeg'
import ytdl from '@distube/ytdl-core';
import * as fs from "fs";
import {logger} from "./Logger.js";
import * as path from "path";
import {sterylizator} from "./Other.js";
import {DebugSaveToFile} from "./DebugMode.js";
import os from "os";
import axios from "axios";
import {exec} from "child_process";

async function downloader(url, votes) {
    const urlParts = url.split('?')[0].split("/");
    const type = urlParts[3];
    logger('verbose', `Wynik splita: ${urlParts}`, 'downloader');
    logger('verbose', `Wykryto: ${urlParts[3]}`, 'downloader');

    switch (type) {
        case 'track':
            logger('log', 'Wykryto piosenkę', 'downloader');
            return downloadSong(url, votes);
        case 'album':
            logger('log', 'Wykryto playlistę', 'downloader');
            return downloadAlbum(url);
        case 'playlist':
            logger('log', 'Wykryto playlistę', 'downloader');
            return downloadPlaylist(url);
        default:
            return handleDefaultCase(url, votes);
    }
}

function handleDefaultCase(url, votes) {
    logger('log', 'Sprawdzam czy to link YT', 'downloader');
    if (url.includes('youtube.com/watch?v=')) {
        logger('log', 'Wykryto link YT', 'downloader');
        return downloadYT(url, votes);
    }
    if (votes) {
        logger('verbose', 'Wykryto próbę pobrania nieautoryzowanego typu linku w głosach!', 'downloader');
        logger('warn', 'Coś przeciekło', 'downloader');
        url='https://open.spotify.com/track/5Wrl4uc9SjC8ZnAimiMtys'; // No przekorny los, bo przeciekło
        return downloadSong(url, votes);
    }
    // logger('warn', 'Nie wykryto typu linku Spotify!', 'downloader');
    logger('warn', 'Nie wykryto typu linku!', 'downloader');
    if (global.debugmode === true) {
        DebugSaveToFile('MusicDownloader', 'downloader', 'catched_link', url);
        logger('verbose', `Zapisano link do debug/`, 'downloader');
    }
    return 'Nie wykryto typu';
}

async function downloadSong(url, votes) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    try {
        const data = await spotify.getTrack(url);
        const file = sterylizator(data.artists.join('-') + '_' + data.name);
        logger('log', `Pobieram: ${data.name + ' by: ' + data.artists.join(', ')}`, 'downloadSong');
        logger('verbose', 'Sprawdzanie czy nie pobieram z głosów...', 'downloadSong');
        if (votes) {
            logger('verbose', 'Pobieranie z głosowania!', 'downloadSong');
            if (fs.existsSync(`./mp3/7/${file}.mp3`)) return logger('warn', `Plik istnieje!`, 'downloadSong');
            const song = await spotify.downloadTrack(url);
            fs.writeFileSync(`./mp3/7/${file}.mp3`, song);
            logger('verbose', 'Normalizacja dźwięku przy użyciu mp3gain...', 'downloadSong');
            exec(`mp3gain -r -c ./mp3/7/${file}.mp3`, (error, stdout, stderr) => {
                logger('verbose', "\n"+ stdout, 'downloadSong')
                if (global.debugmode === true) {
                    DebugSaveToFile('MusicDownloader', 'downloadSong', 'mp3gain', stdout);
                    logger('verbose', `Zapisano do debug/`, 'downloadSong');
                }
            });
            return logger('log', 'Pobrano :>', 'downloadSong');
        }
        if (fs.existsSync(`./mp3/onDemand/${file}.mp3`)) return logger('warn', `Plik istnieje!`, 'downloadSong');
        const song = await spotify.downloadTrack(url);
        fs.writeFileSync(`./mp3/onDemand/${file}.mp3`, song);
        exec(`mp3gain -r -c ./mp3/onDemand/${file}.mp3`, (error, stdout, stderr) => logger('verbose',"\n" + stdout, 'downloadSong'));
        return logger('log', 'Pobrano :>', 'downloadSong');
    } catch (e) {
        logger('error', "Błąd w trakcie wykonywania funkcji downloadSong", 'downloadSong');
        logger('error', e, 'downloadSong');
        if (global.debugmode === true) {
            DebugSaveToFile('MusicDownloader', 'downloadSong', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadSong');
        }
    }
}

async function downloadPlaylist(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    try {
        const data = await spotify.getPlaylist(url);
        for (let i in data.tracks) {
            let song = await getTrackInfo(data.tracks[i]);
            logger('log', `Pobieranie: ${song.name + ' by: ' + song.artists.join(', ')}`, 'downloadPlaylist');
        }
        const playlist = await spotify.downloadPlaylist(url)
        for (let i in playlist) {
            let song = await getTrackInfo(data.tracks[i]);
            const dir = sterylizator(data.name);
            if (!fs.existsSync(`./mp3/onDemand/${dir}`)) {
                fs.mkdirSync(`./mp3/onDemand/${dir}`);
            }
            const file = sterylizator(song.artists.join('-') + '_' + song.name);
            if (fs.existsSync(`./mp3/onDemand/${dir}/${file}.mp3`)) {
                logger('warn', `${file}.mp3 - Plik istnieje!`, 'downloadPlaylist');
                continue;
            }
            fs.writeFileSync(`./mp3/onDemand/${dir}/${file}.mp3`, playlist[i]);
        }
    } catch (e) {
        logger('error', "Błąd w trakcie wykonywania funkcji downloadPlaylist", 'downloadPlaylist');
        logger('error', e, 'downloadPlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('MusicDownloader', 'downloadPlaylist', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'downloadPlaylist');
        }
    }
}

async function downloadAlbum(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    try {
        const data = await spotify.getAlbum(url);
        const dir = sterylizator(data.name);
        if (!fs.existsSync(`./mp3/onDemand/${dir}`)) {
            fs.mkdirSync(`./mp3/onDemand/${dir}`);
        }
        for (let i in data.tracks) {
            let song = await getTrackInfo(data.tracks[i]);
            logger('log', `Pobieranie: ${song.name + ' by: ' + song.artists.join(', ')}`, 'downloadAlbum');
        }
        const album = await spotify.downloadAlbum(url);
        for (let i in album) {
            let song = await getTrackInfo(data.tracks[i]);
            const file = sterylizator(song.artists.join('-') + '_' + song.name);
            if (fs.existsSync(`./mp3/onDemand/${dir}/${file}.mp3`)) {
                logger('warn', `${file}.mp3 - Plik istnieje!`, 'downloadAlbum');
                continue;
            }
            fs.writeFileSync(`./mp3/onDemand/${dir}/${file}.mp3`, album[i]);
        }
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
        const taboret = await ytdl.getBasicInfo(url);
        const trackInfo = {
            name: taboret.videoDetails.title,
            artists: [taboret.videoDetails.author.name + "_-" || "Unknown Artist"],
        };
        return trackInfo;
    }
    if (urlParts[3] === 'album') {
        logger('log', 'Wykryto album', 'getTrackInfo');
        return await spotify.getAlbum(url);
    } else if (urlParts[3] === 'playlist') {
        logger('log', 'Wykryto playlistę', 'getTrackInfo');
        return await spotify.getPlaylist(url);
    } else {
        logger('log', 'Wykryto piosenkę', 'getTrackInfo');
        return await spotify.getTrack(url);
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
async function downloadYT(url, votes) {
    try {
        const song = await ytdl.getBasicInfo(url);
        const description = song.videoDetails.description.toLowerCase();
        const title = song.videoDetails.title.toLowerCase();
        const musicKeywords = ['official music video', 'lyrics', 'audio', 'album', 'song', 'spotify', 'tidal', 'muzyka', 'muzy', 'muza'];
        if (song.videoDetails.category !== 'Music') {
            logger('log', `KATEGORIA ENTERTAINMENT!`, 'downloadYT');
            if (musicKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
                if (song.videoDetails.lengthSeconds > 600) {
                    logger('warn', `To jest film, nie piosenka, bo jest zbyt długa!`, 'downloadYT');
                    return;
                }
                logger('log', `Wykryto, że to piosenka z kategorii Entertainment!`, 'downloadYT');
            } else {
                logger('warn', `Nie wykryto słów kluczowych aby rozpoznać, czy jest to piosenka!`, 'downloadYT');
                return;
            }
        }

        const file = sterylizator(song.videoDetails.author.name+' - '+song.videoDetails.title);
        let filePath = `./mp3/onDemand/${file}.mp3`;
        if (votes) filePath = `./mp3/7/${file}.mp3`;
        if (fs.existsSync(filePath)) return logger('warn', `Plik istnieje!`, 'downloadYT');
        
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

        const tempFilePath = path.resolve(`${os.tmpdir()}/${file}.webm`);
        let outputFilePath = path.resolve(`./mp3/onDemand/${file}.mp3`);
        if (votes) outputFilePath = path.resolve(`./mp3/7/${file}.mp3`);
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
        return logger('log', 'Pobrano :>', 'downloadYT');

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

export { downloader, downloadPlaylist, downloadAlbum, getTrackInfo, autoRemoveFiles, downloadYT };