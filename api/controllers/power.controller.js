// noinspection HttpUrlsUsage

import {logger} from "../../modules/Logger.js";
import {DebugSaveToFile} from "../../modules/DebugMode.js";
import axios from "axios";

const wzmakURI = `http://${process.env.WZMAK}/cm?cmnd=`;
const mixerURI = `http://${process.env.MIXER}/cm?cmnd=`;

export async function wzmakPower(req, res) {
    try {
        const action = req.query.action;
        if (action === 'on') {
            logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - wzmakPower');
            return res.status(200).send((await (await axios.get(wzmakURI + 'POWER ON')).data));
        } else if (action === 'off') {
            logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - wzmakPower');
            return res.status(200).send((await (await axios.get(wzmakURI + 'POWER OFF')).data));
        } else if (action === 'status') {
            return res.status(200).send((await (await axios.get(wzmakURI + 'status 8')).data.StatusSNS.ENERGY));
        }
        return res.status(402).send('nieznanen');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas komunikacji z wtyczką', 'LocalAPI - wzmakPower');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'wzmakPower', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - wzmakPower');
        }
    }
}

export async function mixerPower(req, res) {
    try {
        const action = req.query.action;
        if (action === 'on') {
            logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - mixerPower');
            return res.status(200).send((await (await axios.get(mixerURI + 'POWER ON')).data));
        } else if (action === 'off') {
            logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - mixerPower');
            return res.status(200).send((await (await axios.get(mixerURI + 'POWER OFF')).data));
        } else if (action === 'status') {
            return res.status(200).send((await (await axios.get(mixerURI + 'status 8')).data.StatusSNS.ENERGY));
        }
        return res.status(402).send('nieznanen');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas komunikacji z wtyczką', 'LocalAPI - mixerPower');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'mixerPower', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - mixerPower');
        }
    }
}