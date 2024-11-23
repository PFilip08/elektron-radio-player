import {logger} from "../../modules/Logger.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import fs from "fs";
import {getVotesData, votesPath} from "../../modules/VotesConnector.js";
import {downloader} from "../../modules/MusicDownloader.js";
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
        logger('verbose', 'Wystąpił błąd podczas usuwania głosu', 'LocalAPI - setVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'setVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - setVotes');
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
                return logger('error ' + err, 'saveVotes');
            }
            if (files.length === 0) return logger('task','Brak plików do usunięcia.','saveVotes');
            for (let i in files) {
                if (fs.lstatSync('./mp3/7/'+files[i]).isDirectory()) {
                    logger('task', `Usunięto folder "${files[i]}" wraz z zawartością`, 'saveVotes');
                    fs.rmSync('./mp3/7/'+files[i], { recursive: true, force: true })
                    continue;
                }
                fs.unlinkSync(path.join('./mp3/7', files[i]));
                logger('task', `Usunięto ${files[i]}`, 'saveVotes')
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
        logger('verbose', 'Wystąpił błąd podczas resetowania głosów', 'LocalAPI - resetVotes');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'resetVotes', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - resetVotes');
        }
    }
}
