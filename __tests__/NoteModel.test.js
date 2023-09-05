import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NoteModel } from '../models/index.js';

describe('NoteModel', () => {
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
    await NoteModel.deleteMany({});
  });

  it('should insert a note into the database', async () => {
    const newNote = {
      content: 'Travel with motorbike',
      folderId: '1',
    };

    const insertedNote = await NoteModel.create(newNote);

    const foundNote = await NoteModel.findById(insertedNote._id);

    expect(foundNote).toBeTruthy();
    expect(foundNote.content).toBe(newNote.content);
    expect(foundNote.folderId).toBe(newNote.folderId); 
  });
});
