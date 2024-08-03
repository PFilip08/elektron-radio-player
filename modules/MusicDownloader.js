import {Spotify} from "spotifydl-core";
import * as fs from "fs";
import {logger} from "./Logger.js";
import * as path from "path";
import {sterylizator} from "./Other.js";

async function downloader(url) {
    const urlParts = url.split('?')[0].split("/");
    logger('verbose', `Wynik splita: ${urlParts}`, 'downloader');
    logger('verbose', `Wykryto: ${urlParts[3]}`, 'downloader');
    if (urlParts[3] === 'track') {
        logger('log', 'Wykryto piosenkę', 'downloader');
        return downloadSong(url);
    } else if (urlParts[3] === 'album') {
        logger('log', 'Wykryto album', 'downloader');
        return downloadAlbum(url);
    } else if (urlParts[3] === 'playlist') {
        logger('log', 'Wykryto playlistę', 'downloader');
        return downloadPlaylist(url);
    }
}

async function downloadSong(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const data = await spotify.getTrack(url);
    const file = sterylizator(data.name);
    logger('log',`Pobieram: ${data.name+' by: '+data.artists.join(', ')}`,'downloadSong');
    if (fs.existsSync(`./mp3/onDemand/${file}.mp3`)) return logger('warn',`Plik istnieje!`,'downloadSong');
    const song = await spotify.downloadTrack(url);
    fs.writeFileSync(`./mp3/onDemand/${file}.mp3`, song);
    return logger('log','Pobrano :>','downloadSong');
}

async function downloadPlaylist(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const data = await spotify.getPlaylist(url);
    for (let i in data.tracks) {
        let song = await getTrackInfo(data.tracks[i])
        logger('log',`Pobieranie: ${song.name+' by: '+song.artists.join(', ')}`,'downloadPlaylist');
    }
    const playlist = await spotify.downloadPlaylist(url)
    for (let i in playlist) {
        let song = await getTrackInfo(data.tracks[i])
        const dir = sterylizator(data.name);
        if (!fs.existsSync(`./mp3/onDemand/${dir}`)){
            fs.mkdirSync(`./mp3/onDemand/${dir}`);
        }
        const file = sterylizator(song.name);
        if (fs.existsSync(`./mp3/onDemand/${dir}/${file}.mp3`)) {
            logger('warn',`${file}.mp3 - Plik istnieje!`,'downloadPlaylist');
            continue;
        }
        fs.writeFileSync(`./mp3/onDemand/${dir}/${file}.mp3`, playlist[i]);
    }
}

async function downloadAlbum(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const data = await spotify.getAlbum(url);
    const dir = sterylizator(data.name);
    if (!fs.existsSync(`./mp3/onDemand/${dir}`)){
        fs.mkdirSync(`./mp3/onDemand/${dir}`);
    }
    for (let i in data.tracks) {
        let song = await getTrackInfo(data.tracks[i])
        logger('log',`Pobieranie: ${song.name+' by: '+song.artists.join(', ')}`,'downloadAlbum');
    }
    const album = await spotify.downloadAlbum(url);
    for (let i in album) {
        let song = await getTrackInfo(data.tracks[i]);
        const file = sterylizator(song.name);
        if (fs.existsSync(`./mp3/onDemand/${dir}/${file}.mp3`)) {
            logger('warn',`${file}.mp3 - Plik istnieje!`,'downloadAlbum');
            continue;
        }
        fs.writeFileSync(`./mp3/onDemand/${dir}/${file}.mp3`, album[i]);
    }
}

async function getTrackInfo(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    const urlParts = url.split("/");
    if (urlParts[3] === 'album') {
        return await spotify.getAlbum(url);
    } else if (urlParts[3] === 'playlist') {
        return await spotify.getPlaylist(url);
    } else {
        return await spotify.getTrack(url);
    }
}

async function autoRemoveFiles() {
    fs.readdir('./mp3/onDemand', (err, files) => {
        if (err) return logger('error '+err,'autoRemoveFiles');
        if (files.length === 0) return logger('task','Brak plików do usunięcia.','autoRemoveFiles');
        for (let i in files) {
            if (fs.lstatSync('./mp3/onDemand/'+files[i]).isDirectory()) {
                logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'autoRemoveFiles');
                fs.rmdirSync('./mp3/onDemand/'+files[i], { force: true, recursive: true });
                continue;
            }
            fs.unlinkSync(path.join('./mp3/onDemand', files[i]));
            logger('task', `Usunięto ${files[i]}`, 'autoRemoveFiles')
        }
    })
}

export { downloader, downloadPlaylist, downloadAlbum, getTrackInfo, autoRemoveFiles };