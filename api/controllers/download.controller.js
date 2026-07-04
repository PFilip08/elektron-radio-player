import {downloader, getTrackInfo} from "../../modules/MusicDownloader.js";
import {logger} from "../../modules/Logger.js";
import schedule from "node-schedule";
import {playOnDemand} from "../../modules/MusicPlayer.js";
import {pathSecurityChecker, sterylizator} from "../../modules/Other.js";
import {scheduleKillTask} from "../../modules/TaskScheduler.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {sterylizatorIP} from "../../modules/Other.js";

// download song through api
export async function downloadSong(req, res) {
    try {
        const uri = req.query.uri;
        let path = undefined;
        if (req.query.path) {
            path = `./mp3/${req.query.path}/`;
            const secuCheck = pathSecurityChecker(req.query.path);
            if (secuCheck.includes('_ATTEMPT')) {
                logger('warn', `Próba pobrania pliku z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - downloadSong');
                return res.status(403).send('Niebezpieczna ścieżka!');
            }
        }
        const downloadStatus = await downloader(uri, false, path);
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - downloadSong');
        if (!uri) return res.status(400).send('Nie podano linku!');
        if (!downloadStatus.includes('Pobrano')) return res.status(500).send(downloadStatus);
        return res.status(201).send('gut; '+downloadStatus);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby pobrania pliku', 'LocalAPI - downloadSong');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'download', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - downloadSong');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

// download and play song
export async function downloadAndPlay(req, res) {
    try {
        const uri = req.query.uri;
        const downloadStatus = await downloader(uri);
        // const time = req.query.time;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - downloadAndPlay');
        //ogarnięte
        // console.log(downloadStatus);
        if (!uri) return res.status(400).send('Nie podano linku!');
        if (!downloadStatus.includes('Pobrano')) return res.status(500).send(downloadStatus);
        const trackInfo = await getTrackInfo(uri);
        const urlParts = uri.split('?')[0].split("/");
        let filename = sterylizator(trackInfo.name);
        if (urlParts[3] === 'track' || urlParts[3] === 'watch') filename = sterylizator(trackInfo.artists.join('-')+'_'+trackInfo.name);
        const startTime = new Date(Date.now() + 1000);
        const killTime = new Date(Date.now() + 500);
        scheduleKillTask(killTime);
        const job = schedule.scheduleJob(`playOnDemand - ${new Date().toLocaleString()}`, startTime, function () {
            playOnDemand(filename);
            logger('log', `On Demand: ${trackInfo.name}`,'massSchedule');
        });
        job.jobData = { filename: filename };
        return res.status(201).send('gut, 1s opóźnienia; '+downloadStatus);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby odtworzenia pliku', 'LocalAPI - downloadAndPlay');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'download/override', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - downloadAndPlay');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}