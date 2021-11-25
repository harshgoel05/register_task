import { getDbClient } from '../util/database';
import * as bcrypt from 'bcryptjs';
import { userSchema } from './users-model';
import { USER_ALREADY_EXISTS, SERVER_ERROR } from '../util/errors';
import * as jwt from 'jsonwebtoken';
import { ErrorHandler } from '../util/error-handler';

export async function signupUser(userData: any) {
  let newUser = (await userSchema.cast(userData)) || userData;
  const dbClient = await getDbClient();

  const user = await dbClient
    .db()
    .collection('users')
    .findOne({ phone: newUser.phone });
  if (user) {
    throw new ErrorHandler(USER_ALREADY_EXISTS);
  }

  await bcrypt.genSalt(10, async function (err, salt) {
    if (err) throw new ErrorHandler(SERVER_ERROR);
    bcrypt.hash(userData.password, salt, async function (err, hash) {
      if (err) throw new ErrorHandler(SERVER_ERROR);
      newUser.password = hash;
      await dbClient.db().collection('users').insertOne(newUser);
    });
  });

  const token = await jwt.sign(
    { phone: userData.phone },
    process.env.JWT_SECRET || ''
  );
  return token;
}
