import {Spotify} from "spotifydl-core";
import * as fs from "fs";
import * as path from "path";

async function downloader(url) {
    // console.log("[Downloader]: WIP");
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const data = await spotify.getTrack(url);
    console.log('Downloading: ', data.name, 'by:', data.artists.join(', '));
    console.log(fs.existsSync(`./mp3/onDemand/${data.name}.mp3`));
    if (fs.existsSync(`./mp3/onDemand/${data.name}.mp3`)) return console.log(`Already downloaded!`);
    const song = await spotify.downloadTrack(url);
    fs.writeFileSync(`./mp3/onDemand/${data.name}.mp3`, song);
    return console.log('Downloaded :>');
}

async function getTrackInfo(url) {
    const spotify = new Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    const data = await spotify.getTrack(url)
    return data;
}

function autoRemoveFiles() {
    fs.readdir('./mp3/onDemand', (err, files) => {
        if (err) throw err; else console.log('[AutoFilesRemover] Brak plików do usunięcia.');
        for (let i in files) {
            fs.unlinkSync(path.join('./mp3/onDemand', files[i]));
        }
    })
}

export { downloader, getTrackInfo, autoRemoveFiles };