import {downloader, getTrackInfo} from "../../modules/MusicDownloader.js";
import {logger} from "../../modules/Logger.js";
import schedule from "node-schedule";
import {playOnDemand} from "../../modules/MusicPlayer.js";
import {sterylizator} from "../../modules/Other.js";
import {scheduleKillTask} from "../../modules/TaskScheduler.js";

// download song through api
export async function downloadSong(req, res) {
    try {
        const uri = req.query.uri;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - downloadSong');
        await downloader(uri);

        return res.status(201).send('gut');
    } catch (e) {
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
        scheduleKillTask(killTime);
        schedule.scheduleJob(startTime, function () {
            playOnDemand(sterylizator(trackInfo.name));
            logger('log', `On Demand: ${trackInfo.name}`,'massSchedule');
        });
        return res.status(201).send('gut, 3s opóźnienia');
    } catch (e) {
        throw e;
    }
}