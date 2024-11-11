import {Router} from 'express';
import {__dirname} from '../app.js';
import {getVotes, delVotes, resetVotes, saveVotes} from "../controllers/votes.controller.js";

const votesRouter = Router();
votesRouter.get('/get', getVotes);
votesRouter.delete('/del/:id', delVotes);
votesRouter.get('/reset', resetVotes);
votesRouter.get('/save', saveVotes);
votesRouter.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/votespanel.html');
});

export default votesRouter;