import { Router, Request, Response } from 'express';
import { validateRequest } from '../util/validate-request';
import { SERVER_ERROR } from '../util/errors';
import { signupUser } from './users-service';
import { userSchema } from './users-model';

/*---------------------------------------------------------
                   Signup User
  --------------------------------------------------------*/

async function handleSignupUser(req: Request, res: Response) {
  try {
    const userData = req.body;
    const token = await signupUser(userData);
    return res.status(200).send({ token });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(SERVER_ERROR);
  }
}

/*---------------------------------------------------------
  ---------------------------------------------------------
                   Controller
  ---------------------------------------------------------
  --------------------------------------------------------*/

export default function usersController() {
  const router = Router();
  router.post('/create', validateRequest('body', userSchema), handleSignupUser);
  return router;
}
