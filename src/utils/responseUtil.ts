import { Response } from "express";
import {IApiResponse } from '../types'

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data?: Object
  ) => {
    const response: IApiResponse = {
      error: statusCode >= 400,
      message,
      data,
    };
  
    return res.status(statusCode).json(response);
  };
  