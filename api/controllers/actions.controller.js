import {logger} from "../../modules/Logger.js";
import {killPlayer, playMusic, playPlaylist} from "../../modules/MusicPlayer.js";

// killPlayer
export async function kill(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - killPlayer');
        await killPlayer();
        return res.status(201).send('gut');
    } catch (e) {
        throw e;
    }
}

// playMusic
export async function pMusic(req, res) {
    try {
        const file = req.query.file;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - pMusic');
        console.log(file)
        await playMusic(file);
        return res.status(201).send('gut');
    } catch (e) {
        throw e;
    }
}

// playMusic
export async function pPlaylist(req, res) {
    try {
        const id = req.query.id;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - pPlaylist');
        console.log(id)
        await playPlaylist(id);
        return res.status(201).send('gut');
    } catch (e) {
        throw e;
    }
}