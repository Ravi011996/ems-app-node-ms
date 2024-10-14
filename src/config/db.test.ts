import mongoose from 'mongoose';
import connectDB from './db';
 // Adjust the path based on your actual file location

jest.mock('mongoose');

// Mock `process.exit` to avoid terminating the process during tests
jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
  throw new Error(`process.exit: ${code}`);
});

// Mock console.error to track calls to it
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('connectDB', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  it('should connect to MongoDB successfully', async () => {
    // Mock mongoose.connect to resolve successfully
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {});
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should fail to connect to MongoDB and exit the process', async () => {
    const errorMessage = 'MongoDB connection error';
    // Mock mongoose.connect to reject with an error
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    try {
      await connectDB();
    } catch (error) {
      const err = error as Error;
      expect(err.message).toEqual('process.exit: 1'); // Check for the process.exit call
    }

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'MongoDB connection failed:',
      new Error(errorMessage)
    );
  });
});
