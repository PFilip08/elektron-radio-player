import express from 'express';
import {logger} from "../modules/Logger.js";
import downloadRouter from "./routes/download.router.js";
import actionsRouter from "./routes/actions.router.js";
import * as path from "node:path";
import { fileURLToPath } from 'url';
import * as os from "node:os";
const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.get('/stats/api', function(req, res){
  const cpu = os.cpus();
  const totalmem = os.totalmem();
  const freemem = os.freemem();
  const uptime = os.uptime();
  const data = [cpu, totalmem, freemem, uptime];
  res.status(200).send(data);
});

app.use('/download', downloadRouter);
app.use('/action', actionsRouter);

export default function () {
  app.listen(port, () => {
    logger('log', 'API na porcie: ' + port, 'LocalAPI');
  })
}
