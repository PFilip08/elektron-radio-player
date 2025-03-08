import express from 'express';
import {logger} from "../modules/Logger.js";
import downloadRouter from "./routes/download.router.js";
import actionsRouter from "./routes/actions.router.js";
import statusRouter from "./routes/status.router.js";
import powerRouter from "./routes/power.router.js";
import votesRouter from "./routes/votes.router.js";
import * as path from "node:path";
import {fileURLToPath} from 'url';
import * as os from "node:os";
import {DebugSaveToFile} from '../modules/DebugMode.js';
import {previousData} from "../modules/ApiConnector.js";
import colors from 'colors';
const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.use(express.static(__dirname+'/public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Ok');
})

app.get('/admin', function(req, res){
  res.sendFile(__dirname+'/public/panel.html');
});

app.get('/stats', function(req, res){
  res.sendFile(__dirname+'/public/cpureportpage.html');
});

app.get('/dash', function(req, res){
  res.sendFile(__dirname+'/public/musicpanel.html');
});

app.get('/dash2', function(req, res){
  res.sendFile(__dirname+'/public/guestpanel.html');
});

app.get('/stats/api', function(req, res){
  const cpu = os.cpus();
  const totalmem = os.totalmem();
  const freemem = os.freemem();
  const uptime = os.uptime();
  const loadavg = os.loadavg();
  const data = [cpu, totalmem, freemem, uptime, loadavg];
  if (global.debugmode === true) {
    DebugSaveToFile('LocalAPI', 'stats/api', 'response', data);
    logger('verbose', 'Dane response dla /stats/api zostały zapisane!', 'LocalAPI - stats/api');
  }
  res.status(200).send(data);
});

app.get('/stats/data', async function (req, res) {
  res.status(200).send(previousData);
});
app.post('/stats/confident', async function (req, res) {
  const logType = req.query.type;
  switch (logType) {
    case 'safeguardd':
      logger('warn', colors.red(`UWAGA! WYŁĄCZONO SAFEGUARD!!! EKonfident nie będzie rejestrował prób puszczenia muzyki!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    case 'safeguarde':
      logger('log', `UWAGA! WŁĄCZONO SAFEGUARD!!! EKonfident będzie ponownie rejestrował próby puszczenia muzyki!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`, 'LocalAPI - EKonfident');
      break;
    case 'weekend':
      logger('warn', colors.red(`UWAGA! Puszczono muzykę w WEEKEND!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    case 'weekenda':
      logger('log', colors.yellow(`UWAGA! Próba puszczenia muzyki w WEEKEND!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    case 'lesson':
      logger('warn', colors.red(`UWAGA! Puszczono muzykę w trakcie LEKCJI!!! MOŻLIWE SĄ POWAŻNE KONSEKWENCJĘ DLA RADIA!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    case 'lessona':
      logger('log', colors.red(`UWAGA! Próba puszczenia muzyki w trakcie LEKCJI!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    case 'hebel':
      logger('warn', colors.yellow(`UWAGA! Próba puszczenie muzyki gdy zarządzono CAŁKOWITY ZAKAZ PUSZCZANIA MUZYKI!!! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    case 'after':
      logger('warn', colors.yellow(`UWAGA! Próba puszczenia muzyki po godzinach pracy radia! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    case 'logicfail':
      logger('error', colors.yellow(`UWAGA! Logika safeguarda się posypała! Request od ${req.hostname} o useragencie ${req.get('User-Agent')}`), 'LocalAPI - EKonfident');
      break;
    default:
      res.status(400).send('Nieznany typ logu');
      break;
  }
  logger('verbose', 'PS: Aby wyłączyć lub włączyć EKonfidenta, wpisz komendę "toggleSafeguard()" w konsoli przeglądarki', 'LocalAPI - EKonfident');
  res.status(200).send('gut confident');
});
app.use('/download', downloadRouter);
app.use('/action', actionsRouter);
app.use('/status', statusRouter);
app.use('/power', powerRouter);
app.use('/votes', votesRouter);

export default function () {
  app.listen(port, () => {
    logger('log', 'API na porcie: ' + port, 'LocalAPI');
  })
}
