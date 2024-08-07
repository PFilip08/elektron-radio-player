import { DebugSaveToFile } from "../../modules/DebugMode.js";
import {logger} from "../../modules/Logger.js";
import { getPlaylistName, playlistSongQuery, playlistListQuery, getPlayingSong } from "../../modules/MusicPlayer.js";

export async function queryPlaylist(req, res) {
    try {
        const id = req.query.id;
        const playlistName = getPlaylistName(id);
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlaylist');

        if (playlistName != id && playlistName != 'nicość') {
            const playlistSongName = await playlistSongQuery(id);
            return res.status(201).json(
                {
                    playlistName: playlistName,
                    playlistSongName: playlistSongName
                }
            )
        }
        return res.status(500).send('Nie znaleziono playlisty o podanym ID!');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby wylistowania piosenek znajdujących się na playliscie!', 'LocalAPI - queryPlaylist');
        DebugSaveToFile('LocalAPI', 'queryPlaylist', 'catched_error', e);
        throw e;
    }
}

export async function queryPlayingMusic(req, res) {
    try {
        const id = req.query.id;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlayedMusic');
        const taboret = await getPlayingSong();
        console.log(taboret)
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby sprawdzenia jaka muzyka gra aktualnie!', 'LocalAPI - queryPlayedMusic');
        DebugSaveToFile('LocalAPI', 'queryPlayedMusic', 'catched_error', e);
        throw e;
    }
}

export async function queryPlaylistList(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlaylistList');
        let playlistListFromFiles = await playlistListQuery()
        let playlistListNames = {};
        playlistListFromFiles.forEach((playlistID, index) => {
            let taboret = getPlaylistName(playlistID)
            console.log(taboret)
            if (taboret != playlistID) {
                playlistListNames[index + 1] = getPlaylistName(playlistID);
            } else if (!Number.isInteger(parseInt(taboret))) {
                playlistListNames[index + 1] = 'Playlista NIEPRAWIDŁOWA!!!';
            } else {
                playlistListNames[index + 1] = 'Nieznana playlista';
            }
        });
        return res.status(201).json(
            {
                playlistNames: playlistListNames,
                playlistList: playlistListFromFiles
            }
        )
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby wylistowania playlist', 'LocalAPI - queryPlaylistList');
        DebugSaveToFile('LocalAPI', 'queryPlaylistlist', 'catched_error', e);
        throw e;
    }
}