import axios from "axios";
import {Agent} from "node:https";
import fs from "fs";
import {logger} from "./Logger.js";
import {messageCounter} from "./ApiConnector.js";

const url = 'https://partyvote.ciac.me/api/playlist?hostId=1&date=';
export const votesPath = './mp3/Votes.json'

const api = axios.create({
    httpsAgent: new Agent(),
    headers: {
        'User-Agent': 'Radio-Elektron_SAW_MONITORING v1.0'
    }
});

async function getVotesData(force) {
    if (messageCounter) return logger('warn', 'Brak neta, pomijanie…', 'getVotesData');
    let date = new Date(); // dzisiaj
    date.setDate(date.getDate() - 1); // wczoraj
    date=date.toLocaleDateString('en-CA') // YYYY-MM-DD
    const res = await api.get(url+date);
    // if (res.data.playlist) {
    //     await fs.writeFileSync('./mp3/Votes.json', JSON.stringify(res.data.playlist, null, 4));
    //     console.log('Playlist zapisany do pliku Votes.json');
    //     return res.data.playlist;
    // }
    async function download() {
        await fs.writeFileSync(votesPath, JSON.stringify(res.data.playlist, null, 4));
    }
    if (force) return await download();
    if (!res.data.playlist) return;
    if (res.data.playlist.length === 0) {
        logger('log', 'Brak danych.', 'getVotesData')
        return 'brak';
    }
    if (!fs.existsSync(votesPath)) await download();
    if (JSON.parse(fs.readFileSync(votesPath)).length === 0) await download();
    if (JSON.parse(fs.readFileSync(votesPath))[0].created_at !== date) await download();  // tu osobno plik, bo inaczej stary był dalej w zmiennej

    return JSON.parse(fs.readFileSync(votesPath));
    // return
}

export {getVotesData};