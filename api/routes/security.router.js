import {Router} from "express";
import {logger} from "../../modules/Logger.js";
import {yellow, red} from 'colorette';

const secRouter = Router();
secRouter.post('/confident', async function (req, res) {
    const logType = req.query.type;
    switch (logType) {
        case 'safeguardd':
            logger('warn', red(`UWAGA! WYŁĄCZONO SAFEGUARD!!! EKonfident nie będzie rejestrował prób puszczenia muzyki!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        case 'safeguarde':
            logger('log', `UWAGA! WŁĄCZONO SAFEGUARD!!! EKonfident będzie ponownie rejestrował próby puszczenia muzyki!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`, 'LocalAPI - EKonfident');
            break;
        case 'weekend':
            logger('warn', red(`UWAGA! Puszczono muzykę w WEEKEND!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        case 'weekenda':
            logger('log', yellow(`UWAGA! Próba puszczenia muzyki w WEEKEND!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        case 'lesson':
            logger('warn', red(`UWAGA! Puszczono muzykę w trakcie LEKCJI!!! MOŻLIWE SĄ POWAŻNE KONSEKWENCJĘ DLA RADIA!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        case 'lessona':
            logger('log', red(`UWAGA! Próba puszczenia muzyki w trakcie LEKCJI!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        case 'hebel':
            logger('warn', yellow(`UWAGA! Próba puszczenie muzyki gdy zarządzono CAŁKOWITY ZAKAZ PUSZCZANIA MUZYKI!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        case 'after':
            logger('warn', yellow(`UWAGA! Próba puszczenia muzyki po godzinach pracy radia! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        case 'logicfail':
            logger('error', yellow(`UWAGA! Logika safeguarda się posypała! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
            break;
        default:
            res.status(400).send('Nieznany typ logu');
            break;
    }
    logger('verbose', 'PS: Aby wyłączyć lub włączyć EKonfidenta, wpisz komendę "toggleSafeguard()" w konsoli przeglądarki', 'LocalAPI - EKonfident');
    res.status(200).send('gut confident');
});

export default secRouter;