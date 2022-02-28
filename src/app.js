import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routers from './routers/index.js';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(routers);

server.listen(process.env.PORT, () => {
  console.log(`Running app in ${process.env.PORT}`);
});
