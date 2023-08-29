import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import 'dotenv/config';
import cors from 'cors';
import { resolvers } from './resolvers/index.js';
import { typeDefs } from './schemas/index.js';
import mongoose from 'mongoose';
import './firebase.config.js';
import { getAuth } from 'firebase-admin/auth';

const app = express();
const httpServer = http.createServer(app);


const DB_URL = process.env.MONGO_DB;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start();

const authorizationJWT = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if(authorizationHeader) {
        const accessToken = authorizationHeader.split(' ')[1];

        getAuth().verifyIdToken(accessToken)
        .then(decode => {
            res.locals.uid = decode.uid;
            next();
        })
        .catch(err => {
            console.log({err});
            return res.status(403).json({message: 'Forbidden', error: err});
        }) 
    } else {
        return res.status(401).json({message: 'Unauthorized'});
    }
   
}

app.use(cors(), authorizationJWT, bodyParser.json(), expressMiddleware(server, {
    context: async ({ req, res }) => {
        return { uid: res.locals.uid };
    }
}));

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('🚀 Connected to DB');
    await new Promise((resolve) => httpServer.listen({port: process.env.PORT}, resolve));
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
})


