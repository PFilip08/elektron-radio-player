import axios from "axios";
import {Agent} from "node:https";
import fs from "fs";
import {logger} from "./Logger.js";
import {messageCounter} from "./ApiConnector.js";
import { DebugSaveToFile } from "./DebugMode.js";
import colors from "colors";

const url = process.env.URI+'/api/playlist?hostId=1&date=';
export const votesPath = './mp3/Votes.json'

const api = axios.create({
    httpsAgent: new Agent(),
    headers: {
        'User-Agent': 'Radio-Elektron_SAW_MONITORING v1.0'
    }
});

async function getVotesData(force) {
    logger('verbose', 'Sprawdzanie czy jest internet...', 'getVotesData');
    if (messageCounter) return logger('warn', 'Brak neta, pomijanie…', 'getVotesData');
    let date = new Date(); // dzisiaj
    date.setDate(date.getDate() - 1); // wczoraj
    date=date.toLocaleDateString('en-CA') // YYYY-MM-DD
    logger('verbose', 'Wysyłanie zapytania do API...', 'getVotesData');
    const res = await api.get(url+date);
    if (global.debugmode === true) {
        DebugSaveToFile('VotesConnector', 'getVotesData', 'response', res);
        logger('verbose', `Response z serwera został zrzucony!`, 'getVotesData');
    }

    async function download() {
        logger('verbose', `Zapisywanie pliku ${votesPath}...`, 'getVotesData - download');
        await fs.writeFileSync(votesPath, JSON.stringify(res.data.playlist, null, 4));
        if (global.debugmode === true) {
            DebugSaveToFile('VotesConnector', 'getVotesData - download', 'saved_to_file', res.data.playlist);
            logger('verbose', `Zrzucono do pliku zagłosowane piosenki!`, 'getVotesData - download');
        }
    }
    logger('verbose', `Sprawdzanie czy nie wymuszono zapisu pliku ${votesPath}...`, 'getVotesData');
    if (force) return await download();
    logger('verbose', `Sprawdzanie czy JSON z API istnieje...`, 'getVotesData');
    if (!res.data.playlist) return;
    logger('verbose', `Sprawdzanie czy JSON z API nie jest pusty...`, 'getVotesData');
    if (res.data.playlist.length === 0) {
        logger('verbose', colors.yellow('JSON z API jest pusty!'), 'getVotesData');
        logger('log', 'Brak danych.', 'getVotesData');
        return 'brak';
    }
    logger('verbose', `Sprawdzanie czy plik ${votesPath} nie istnieje...`, 'getVotesData');
    if (!fs.existsSync(votesPath)) await download();
    logger('verbose', `Sprawdzanie czy plik ${votesPath} nie jest pusty...`, 'getVotesData');
    if (JSON.parse(fs.readFileSync(votesPath)).length === 0) await download();
    logger('verbose', `Sprawdzanie czy data zapisu pliku ${votesPath} jest inna niż data z API...`, 'getVotesData');
    if (JSON.parse(fs.readFileSync(votesPath))[0].created_at !== date) await download();  // tu osobno plik, bo inaczej stary był dalej w zmiennej

    return JSON.parse(fs.readFileSync(votesPath));
}

export {getVotesData};