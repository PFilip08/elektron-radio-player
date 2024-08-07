import {downloader, getTrackInfo} from "../../modules/MusicDownloader.js";
import {logger} from "../../modules/Logger.js";
import schedule from "node-schedule";
import {playOnDemand} from "../../modules/MusicPlayer.js";
import {sterylizator} from "../../modules/Other.js";
import {scheduleKillTask} from "../../modules/TaskScheduler.js";
import { DebugSaveToFile } from "../../modules/DebugMode.js";

// download song through api
export async function downloadSong(req, res) {
    try {
        const uri = req.query.uri;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - downloadSong');
        await downloader(uri);
        if (await downloader(uri) === 'Nie wykryto typu') return res.status(500).send('Nie można wykryć typu linku Spotify!');
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby pobrania pliku', 'LocalAPI - downloadSong');
        DebugSaveToFile('LocalAPI', 'download', 'catched_error', e);
        throw e;
    }
}

// download and play song
export async function downloadAndPlay(req, res) {
    try {
        const uri = req.query.uri;
        // const time = req.query.time;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - downloadAndPlay');
        await downloader(uri);
        const startTime = new Date(Date.now() + 3000);
        const killTime = new Date(Date.now() + 2000);
        const trackInfo = await getTrackInfo(uri);
        if (await downloader(uri) === 'Nie wykryto typu') return res.status(500).send('Nie można wykryć typu linku Spotify!');
        scheduleKillTask(killTime);
        schedule.scheduleJob(startTime, function () {
            playOnDemand(sterylizator(trackInfo.name));
            logger('log', `On Demand: ${trackInfo.name}`,'massSchedule');
        });
        return res.status(201).send('gut, 3s opóźnienia');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby odtworzenia pliku', 'LocalAPI - downloadAndPlay');
        DebugSaveToFile('LocalAPI', 'download/override', 'catched_error', e);
        throw e;
    }
}