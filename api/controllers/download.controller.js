import {downloader, getTrackInfo} from "../../modules/MusicDownloader.js";
import {logger} from "../../modules/Logger.js";
import schedule from "node-schedule";
import {playOnDemand} from "../../modules/MusicPlayer.js";
import {sterylizator} from "../../modules/Other.js";
import {scheduleKillTask} from "../../modules/TaskScheduler.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";

// download song through api
export async function downloadSong(req, res) {
    try {
        const uri = req.query.uri;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - downloadSong');
        if (!uri) return res.status(400).send('Nie podano linku!');
        await downloader(uri);
        if (await downloader(uri) === 'Nie wykryto typu') return res.status(500).send('Nie można wykryć typu linku Spotify!');
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby pobrania pliku', 'LocalAPI - downloadSong');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'download', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - downloadSong');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów');
    }
}

// download and play song
export async function downloadAndPlay(req, res) {
    try {
        const uri = req.query.uri;
        const downloadStatus = await downloader(uri);
        // const time = req.query.time;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - downloadAndPlay');
        if (!uri) return res.status(400).send('Nie podano linku!');
        if (downloadStatus === 'Nie wykryto typu') return res.status(500).send('Nie można wykryć typu linku Spotify!');
        if (downloadStatus === 'Nie można pobrać bo to jest film') return res.status(500).send('Nie można pobrać z YT bo to jest film a nie muzyka!');
        if (downloadStatus === 'Nie można pobrać bo nie wykryto słów kluczowych w opisie') return res.status(500).send('Nie można pobrać z YT bo nie wykryto słów kluczowych w opisie!');
        // await downloader(uri);
        const startTime = new Date(Date.now() + 3000);
        const killTime = new Date(Date.now() + 2000);
        const trackInfo = await getTrackInfo(uri);
        scheduleKillTask(killTime);
        const urlParts = uri.split('?')[0].split("/");
        let filename = sterylizator(trackInfo.name);
        if (urlParts[3] === 'track' || urlParts[3] === 'watch') filename = sterylizator(trackInfo.artists.join('-')+'_'+trackInfo.name);
        schedule.scheduleJob(startTime, function () {
            playOnDemand(filename);
            logger('log', `On Demand: ${trackInfo.name}`,'massSchedule');
        });
        return res.status(201).send('gut, 3s opóźnienia');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby odtworzenia pliku', 'LocalAPI - downloadAndPlay');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'download/override', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - downloadAndPlay');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów');
    }
}