import express from 'express';
import {logger} from "../modules/Logger.js";
import downloadRouter from "./routes/download.router.js";
import actionsRouter from "./routes/actions.router.js";
import statusRouter from "./routes/status.router.js";
import powerRouter from "./routes/power.router.js";
import votesRouter from "./routes/votes.router.js";
import devRouter from "./routes/dev.router.js";
import secRouter from "./routes/security.router.js";
import * as path from "node:path";
import {fileURLToPath} from 'url';
import * as os from "node:os";
import {DebugSaveToFile} from '../modules/DebugMode.js';
import {previousData} from "../modules/ApiConnector.js";
import expressLayouts from 'express-ejs-layouts';
const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views/');
app.set('layout', __dirname+'/views/layouts/layout');

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Ok');
})

app.get('/admin', function(req, res){
  res.render('adminpanel', {
    title: 'Admin Panel',
    welcome: 'Witaj na panelu zarządzania elektron-radio-playerem!',
    layout: 'layouts/admin_layout'
  });
});

app.get('/stats', function(req, res){
  res.render('stats', {
    title: 'Stats Panel',
    welcome: 'Statystyki',
  });
});

app.get('/dash', function(req, res){
  res.render('musicpanel', {
    title: 'Music Panel',
    welcome: 'Mjuzik panel',
    guest: false,
  });
});

app.get('/dash2', function(req, res){
  res.render('musicpanel', {
    title: 'Music Panel',
    welcome: 'Mjuzik panel',
    guest: true,
    navbar: false,
  });
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

app.use('/security', secRouter);
app.use('/download', downloadRouter);
app.use('/action', actionsRouter);
app.use('/status', statusRouter);
app.use('/power', powerRouter);
app.use('/votes', votesRouter);
app.use('/dev', devRouter);

export default function () {
  app.listen(port, () => {
    logger('log', 'API na porcie: ' + port, 'LocalAPI');
  })
}
