import express from 'express';
import {logger} from "../modules/Logger.js";
import downloadRouter from "./routes/download.router.js";
import actionsRouter from "./routes/actions.router.js";
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Ok');
})

app.use('/download', downloadRouter);
app.use('/action', actionsRouter);

export default function () {
  app.listen(port, () => {
    logger('log', 'API na porcie: ' + port, 'LocalAPI');
  })
}
