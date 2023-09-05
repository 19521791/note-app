import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { FolderModel } from '../models/index.js';

describe('FolderModel', () => {
  let mongoServer;

  beforeAll(async () => {
    jest.setTimeout(10000);
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await FolderModel.deleteMany({});
  });

  it('should insert a folder into the database', async () => {
    const newFolder = {
      name: 'Plan for Vacation',
      authorId: '1',
    };

    const insertedFolder = await FolderModel.create(newFolder);

    const foundFolder = await FolderModel.findById(insertedFolder._id);

    expect(foundFolder).toBeTruthy();
    expect(foundFolder.name).toBe(newFolder.name); 
    expect(foundFolder.authorId).toBe(newFolder.authorId);
  });
});
