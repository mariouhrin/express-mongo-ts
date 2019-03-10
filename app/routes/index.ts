import { Router } from 'express';
import * as handlers from './../handlers';

const router: Router = Router();

router.get('/customers', handlers.getAllData);

export const Routes: Router = router;
