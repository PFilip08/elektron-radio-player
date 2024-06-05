import {Spotify} from "spotifydl-core";
import * as fs from "fs";
import * as path from "path";
import {logger} from "./Logger.js";

async function downloader(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const data = await spotify.getTrack(url);
    const file = data.name.split(' ').join('_').replace(/[^a-zA-Z_]/g, "");
    logger('log',`Downloading: ${data.name+' by: '+data.artists.join(', ')}`,'downloader');
    // console.log(fs.existsSync(`./mp3/onDemand/${file}.mp3`));
    if (fs.existsSync(`./mp3/onDemand/${file}.mp3`)) return logger('warn',`Already downloaded!`,'downloader');
    const song = await spotify.downloadTrack(url);
    fs.writeFileSync(`./mp3/onDemand/${file}.mp3`, song);
    return logger('log','Downloaded :>','downloader');
}

async function getTrackInfo(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    return await spotify.getTrack(url);
}

function autoRemoveFiles() {
    fs.readdir('./mp3/onDemand', (err, files) => {
        if (err) throw err; else logger('task','Brak plików do usunięcia.','autoRemoveFiles');
        for (let i in files) {
            fs.unlinkSync(path.join('./mp3/onDemand', files[i]));
            logger('task', `Usunięto ${files[i]}`, 'autoRemoveFiles')
        }
    })
}

export { downloader, getTrackInfo, autoRemoveFiles };