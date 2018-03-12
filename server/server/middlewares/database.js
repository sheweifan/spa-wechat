import mongoose from 'mongoose';
import fs from 'fs';
import { resolve } from 'path';
import config from '../config';

const modals = resolve(__dirname, '../database/schema');

fs.readdirSync(modals)
  .filter(file=> ~file.search(/^[^\.].*js$/))
  .forEach(file=> require(resolve(modals, file)))


export const database = app =>{
  mongoose.set('debug', true);

  mongoose.connect(config.db);

  mongoose.connection.on('disconneted', ()=>{
    mongoose.connect(config.db);
  })

  mongoose.connection.on('err', err=> console.log(err))
  mongoose.connection.on('open', err=> {
    console.log('connected to db', config.db);
  })

}