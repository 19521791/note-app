import pkg from 'graphql';
import { FolderModel, AuthorModel, NoteModel } from '../models/index.js';
import { PubSub } from 'graphql-subscriptions';

const { GraphQLScalarType } = pkg;
const pubsub = new PubSub();

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.toISOString();
        }
    }),

    Query: {
        folders: async (parent, args, context) => { 
            const folders = await FolderModel.find({
                authorId: context.uid
            }).sort({
                updatedAt: 'desc'
            });
            return folders;
        },
        folder: async (parent, args) => {
            const folderId = args.folderId;
            const foundFolder = await FolderModel.findById(folderId);
            return foundFolder;
        },
        note: async (parent, args) => {
            const noteId = args.noteId;
            const note = await NoteModel.findById(noteId);
            return note;
        }
    },
    Folder: {
        author: async (parent, args) => { 
            const authorId = parent.authorId;
            const author = await AuthorModel.findOne({
                uid: authorId
            });
            return author;
        },
        notes: async (parent, args) => {
            const notes = await NoteModel.find({
                folderId: parent.id
            }).sort({
                updatedAt: 'desc'
            });
            return notes;
        }
    },
    Mutation: {
        addNote: async (parent, args) => {
            const newNote = new NoteModel(args);
            await newNote.save();
            return newNote;
        },
        updateNote: async (parent, args) => {
            const noteId = args.id;
            const note = await NoteModel.findByIdAndUpdate(noteId, args);
            return note;
        },
        addFolder: async (parent, args, context) => {
            const newFolder = new FolderModel({...args, authorId: context.uid});
            pubsub.publish('FOLDER_CREATED', {
                folderCreated: {
                    message: 'New folder has been created'
                }
            });
            await newFolder.save();
            return newFolder;
        },
        updateFolder: async (parent, args) => {
            const folderId = args.folderId;
            const updatedFolder = await FolderModel.findByIdAndUpdate(
                folderId,
                { name: args.name },
                { new: true },
            );
            return updatedFolder;
        },
        deleteFolder: async ( parent, args ) => {
            const folderId = args.folderId;
            const noteId = args?.noteId;
            try {
                const data = await FolderModel.findByIdAndRemove(folderId);
                if(noteId) {
                    const data_ = await NoteModel.deleteMany({noteId});
                } 

                return data;
            } catch (err) {
                console.error(`Error deleting folder and notes: ${err}`);
            }
        },
        register: async (parent, args) => {
            const foundUser = await AuthorModel.findOne({ uid: args.uid });

            if(!foundUser){
                const newUser = new AuthorModel(args);
                await newUser.save();
                return newUser;
            }

            return foundUser;
        }
    },
    Subscription: {
        folderCreated: {
            subscribe: () =>pubsub.asyncIterator(['FOLDER_CREATED', 'NOTE_CREATED'])
        }
    },
};