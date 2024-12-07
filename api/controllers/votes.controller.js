import {logger} from "../../modules/Logger.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import fs from "fs";
import {getVotesData, votesPath} from "../../modules/VotesConnector.js";
import {downloader, getTrackInfo} from "../../modules/MusicDownloader.js";
import path from "path";
import {checkIfVLConVotes} from "../../modules/Other.js";
import {killPlayerForce} from "../../modules/MusicPlayer.js";

export async function getVotes(req, res) {
    try {
        if (!fs.existsSync(votesPath)) return res.status(500).send('Brak pliku!!');
        const data = JSON.parse(fs.readFileSync(votesPath));
        return res.status(200).send(data);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas pobierania głosów', 'LocalAPI - getVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'getVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - getVotes');
        }
    }
}

export async function delVotes(req, res) {
    try {
        const { id } = req.params;
        if (!fs.existsSync(votesPath)) return res.status(500).send('Brak pliku!!');
        const data = JSON.parse(fs.readFileSync(votesPath));

        const index = data.findIndex(vote => vote.id === parseInt(id));
        if (index === -1) {
            return res.status(404).send('Głos nie znaleziony!');
        }
        data.splice(index, 1);
        fs.writeFileSync(votesPath, JSON.stringify(data, null, 2));

        return res.status(200).send('Głos usunięty');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas usuwania głosu', 'LocalAPI - delVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'delVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - delVotes');
        }
        return res.status(500).send('Błąd serwera podczas usuwania głosu');
    }
}

export async function resetVotes(req, res) {
    try {
        await getVotesData(true);
        logger('log', 'Zresetowano', 'resetVotes');
        return res.status(200).send('ok');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas resetowania głosów', 'LocalAPI - resetVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'resetVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - resetVotes');
        }
    }
}

export async function saveVotes(req, res) {
    try {
        if (await checkIfVLConVotes()) killPlayerForce();
        // console.log(await checkIfVLConVotes());
        fs.readdir('./mp3/7', (err, files) => {
            if (err) {
                res.status(500).send('dział taboretów trza zagonić do roboty');
                if (global.debugmode === true) {
                    DebugSaveToFile('LocalAPI', 'saveVotes', 'catched_error', err);
                    logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - saveVotes');
                }
                return logger('error ' + err, 'saveVotes');
            }
            if (files.length === 0) return logger('task','Brak plików do usunięcia.','saveVotes');
            for (let i in files) {
                if (fs.lstatSync('./mp3/7/'+files[i]).isDirectory()) {
                    logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'saveVotes');
                    fs.rmSync('./mp3/7/'+files[i], { recursive: true, force: true });
                    continue;
                }
                fs.unlinkSync(path.join('./mp3/7', files[i]));
                logger('task', `Usunięto ${files[i]}`, 'saveVotes');
            }
        });
        const data = await getVotesData();
        if (data === 'brak') return logger('log', 'Brak danych!!!', 'saveVotes');
        for (let i in data) {
            await downloader(data[i].uSongs.url, true);
        }
        logger('log', 'Zapisano', 'saveVotes');
        return res.status(200).send('ok');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas zapisywania głosów', 'LocalAPI - saveVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'saveVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - saveVotes');
        }
    }
}

export async function downloadVotes(req, res) {
    try {
        const { date } = req.query;
        if (await checkIfVLConVotes()) killPlayerForce();
        fs.readdir('./mp3/7', (err, files) => {
            if (err) {
                res.status(500).send('dział taboretów trza zagonić do roboty');
                return logger('error ' + err, 'downloadVotes');
            }
            if (files.length === 0) return logger('task','Brak plików do usunięcia.','downloadVotes');
            for (let i in files) {
                if (fs.lstatSync('./mp3/7/'+files[i]).isDirectory()) {
                    logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'downloadVotes');
                    fs.rmSync('./mp3/7/'+files[i], { recursive: true, force: true })
                    continue;
                }
                fs.unlinkSync(path.join('./mp3/7', files[i]));
                logger('task', `Usunięto ${files[i]}`, 'downloadVotes')
            }
        });
        const data = await getVotesData(undefined, date);
        if (data === 'brak') {
            logger('log', 'Brak danych!!!', 'downloadVotes')
            return res.status(410).send('brak danych');
        }
        for (let i in data) {
            await downloader(data[i].uSongs.url, true);
        }
        logger('log', 'Zapisano', 'downloadVotes');
        return res.status(200).send('ok');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas pobierania głosów', 'LocalAPI - downloadVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'downloadVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - downloadVotes');
        }
    }
}

export async function addVotes(req, res) {
    try {
        if (!fs.existsSync(votesPath)) {
            fs.writeFileSync(votesPath, JSON.stringify([]));
        }

        let data = JSON.parse(fs.readFileSync(votesPath));
        const newId = data.length > 0 ? Math.max(...data.map(vote => vote.id)) + 1 : 1;
        let { uri } = req.query;
        if (uri.length === 0) uri = 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC';

        // console.log(await getTrackInfo(uri));
        const songData = await getTrackInfo(uri);

        const newVoteEntry = {
            id: newId,
            created_at: new Date().toISOString().split('T')[0],
            party_id: 1,
            uSongs: {
                title: songData.name || null,
                artist: songData.album_name || null,
                duration: null,
                thumbnail: songData.cover_url || null,
                explicit: undefined,
                url: uri || null,
                created_at: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
            },
        };

        data.push(newVoteEntry);
        fs.writeFileSync(votesPath, JSON.stringify(data, null, 2));

        return res.status(201).send(newVoteEntry);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas dodawania głosów', 'LocalAPI - addVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'addVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - addVotes');
        }
        return res.status(500).send('Wystąpił błąd serwera');
    }
}

export async function download(req, res) {
    try {
        let data = JSON.parse(fs.readFileSync(votesPath));
        if (data === '[]') {
            logger('log', 'Brak danych!!!', 'download');
            return res.status(410).send('brak danych');
        }
        for (let i in data) {
            await downloader(data[i].uSongs.url, true);
        }
        logger('log', 'Zapisano', 'download');
        return res.status(200).send('ok');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas pobierania mp3', 'LocalAPI - download');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'download', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - download');
        }
    }
}

export async function delmp3(req, res) {
    try {
        if (await checkIfVLConVotes()) killPlayerForce();
        fs.readdir('./mp3/7', (err, files) => {
            if (err) {
                res.status(500).send('dział taboretów trza zagonić do roboty');
                return logger('error ' + err, 'delmp3');
            }
            if (files.length === 0) return logger('task','Brak plików do usunięcia.','delmp3');
            for (let i in files) {
                if (fs.lstatSync('./mp3/7/'+files[i]).isDirectory()) {
                    logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'delmp3');
                    fs.rmSync('./mp3/7/'+files[i], { recursive: true, force: true })
                    continue;
                }
                fs.unlinkSync(path.join('./mp3/7', files[i]));
                logger('task', `Usunięto ${files[i]}`, 'delmp3');
            }
        });
        logger('log', 'Usunięto mp3', 'delmp3');
        return res.status(200).send('ok');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas usuwania mp3', 'LocalAPI - delmp3');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'delmp3', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - delmp3');
        }
    }
}