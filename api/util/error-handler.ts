import { Response } from 'express';

export interface ErrorResponse {
  message?: string;
  stack?: any;
  statusCode?: number;
  status: string;
}

/*----------------------------------------------------------*
                      Error class
 -----------------------------------------------------------*/
export class ErrorHandler extends Error {
  statusCode: number;
  message: string;
  explicit: boolean;
  constructor(error) {
    super();
    this.explicit = true;
    this.statusCode = error.code || 500;
    this.message = error.message;
    if (!this.message) {
      if (this.statusCode === 500) {
        this.message = 'Internal Server error';
      } else {
        this.message = 'Some unknown error occured.';
      }
    }
  }
}

export const handleError = (err: any, res: Response) => {
  const { statusCode, message, stack } = err;
  const responseObject: ErrorResponse = { status: 'error', stack };
  /*----------------------------------------------------------*
                      Message according to error
    -----------------------------------------------------------*/
  switch (true) {
    case err.constructor.name === 'MongoError': {
      responseObject.message = 'Service Unavailable';
      responseObject.statusCode = 503;
      break;
    }
    case err.constructor.name === 'ValidationError': {
      responseObject.message = err.errors[0];
      responseObject.statusCode = 400;
      break;
    }
    case 'explicit' in err: {
      responseObject.message = message;
      responseObject.statusCode = statusCode;
      break;
    }
    default: {
      responseObject.message = 'Internal Server error';
      responseObject.statusCode = 500;
    }
  }
  /*----------------------------------------------------------
                      Include Stack if dev environment
    -----------------------------------------------------------*/

  if (process.env.ENVIRONMENT == 'dev') {
    console.log(responseObject);
    res.status(responseObject.statusCode).json(responseObject);
  } else {
    const { stack, ...prodResponseObject } = responseObject;
    res.status(prodResponseObject.statusCode).json(prodResponseObject);
  }
};
