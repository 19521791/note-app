import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthorModel } from '../models/index.js';

describe('AuthorModel', () => {
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

  it('should insert an author into the database', async () => {
    const newAuthor = {
      uid: '1',
      name: 'Nguyen Long',
    };

    const insertedAuthor = await AuthorModel.create(newAuthor);

    const foundAuthor = await AuthorModel.findOne({ uid: '1' });

    expect(insertedAuthor).toMatchObject(newAuthor);
    expect(foundAuthor).toMatchObject(newAuthor);
  });
});
