import mongoose from 'mongoose';
import connectDB from './db';

jest.mock('mongoose');

jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
  throw new Error(`process.exit: ${code}`);
});

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('connectDB', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB successfully', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
     await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {});
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should fail to connect to MongoDB and exit the process', async () => {
    const errorMessage = 'MongoDB connection error';
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    try {
      await connectDB();
    } catch (error) {
      const err = error as Error;
      expect(err.message).toEqual('process.exit: 1');
    }

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'MongoDB connection failed:',
      new Error(errorMessage)
    );
  });
});
