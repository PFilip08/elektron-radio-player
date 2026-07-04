import {Router} from 'express';
import {__dirname} from '../app.js';
import {getVotes, delVotes, resetVotes, saveVotes, downloadVotes, addVotes, download, delmp3} from "../controllers/votes.controller.js";
import { emptyVotes, downloaded } from '../../modules/TaskScheduler.js';

const votesRouter = Router();
votesRouter.get('/', (req, res) => {
    res.render('votespanel', {
        title: 'Votes panel',
        welcome: 'Votes panel',
    });
});
votesRouter.get('/status', (req, res) => {
    const payload = {
        downloaded: downloaded,
        emptyVotes: emptyVotes
    }
    res.json(payload);
});

votesRouter.get('/get', getVotes);
votesRouter.delete('/del/:id', delVotes);
votesRouter.post('/add', addVotes);
votesRouter.post('/reset', resetVotes);
votesRouter.post('/save', saveVotes);
votesRouter.post('/downloadVotes', downloadVotes);
votesRouter.post('/download', download);
votesRouter.delete('/delmp3', delmp3);

export default votesRouter;