import axios from "axios";
import {Agent} from "node:https";

const url = 'https://partyvote.ciac.me/api/playlist?hostId=1&date=';

const api = axios.create({
    httpsAgent: new Agent(),
    headers: {
        'User-Agent': 'Radio-Elektron_SAW_MONITORING v1.0'
    }
});

async function getVotesData() {
    let date = new Date(); // dzisiaj
    date.setDate(date.getDate() - 1); // wczoraj
    date=date.toLocaleDateString('en-CA') // YYYY-MM-DD
    return await api.get(url+date)
        .then(res => {
            return res.data.playlist;
        });
}

export {getVotesData};