import mongoose from 'mongoose';

export interface IExpense extends Document {
    title: string;
    amount: number;
    category: string;
    date: string;
    userId: string;
  }
  
  export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
  }

 export interface IApiResponse {
    error: boolean;
    message: string;
    data?: any;
  }