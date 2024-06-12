import {downloader, getTrackInfo} from "../../modules/MusicDownloader.js";
import {logger} from "../../modules/Logger.js";
import schedule from "node-schedule";
import {playOnDemand} from "../../modules/MusicPlayer.js";

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
        const time = req.query.time;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - downloadAndPlay');
        await downloader(uri);
        const trackInfo = await getTrackInfo(uri)
        schedule.scheduleJob(``, function () {
            playOnDemand(trackInfo.name.split(' ').join('_').replace(/[^a-zA-Z_-\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g, ""));
            logger('log', `On Demand: ${trackInfo.name}`,'massSchedule');
        });
        return res.status(201).send('gut');
    } catch (e) {
        throw e;
    }
}