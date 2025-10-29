import {Router} from 'express';
import {__dirname} from '../app.js';
import {getVotes, delVotes, resetVotes, saveVotes, downloadVotes, addVotes, download, delmp3} from "../controllers/votes.controller.js";
import { emptyVotes, downloaded } from '../../modules/TaskScheduler.js';

const votesRouter = Router();
votesRouter.get('/get', getVotes);
votesRouter.get('/status', (req, res) => {
    const payload = {
        downloaded: downloaded,
        emptyVotes: emptyVotes
    }
    res.json(payload);
});
votesRouter.delete('/del/:id', delVotes);
votesRouter.get('/add', addVotes);
votesRouter.get('/reset', resetVotes);
votesRouter.get('/save', saveVotes);
votesRouter.get('/downloadVotes', downloadVotes);
votesRouter.get('/download', download);
votesRouter.get('/delmp3', delmp3);
votesRouter.get('/', (req, res) => {
    res.render('votespanel', {
        title: 'Votes panel',
        welcome: 'Votes panel',
    });
});

export default votesRouter;