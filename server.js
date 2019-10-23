import express from 'express';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import getSchema from './graphql/schema.js';

const options = {
   connectTimeoutMS: 30000,
   useNewUrlParser: true,
   dbName: 'project'
};

const kanjiSchema = new mongoose.Schema({
	literal: String,
	onyomi: [String],
	kunyomi: [String],
	nanori: [String],
	gloss: [String],
	grade: String,
	jlpt: String,
	frequency: String,
	stroke: String
});

mongoose.connect("mongodb://localhost:27017", options);
const kanjiCollection = mongoose.model('kanji', kanjiSchema, 'kanji');

const schema = getSchema(kanjiCollection);

const graphQLServer = express();
graphQLServer.use('/', graphqlHTTP({ schema: schema, graphiql: true }));
graphQLServer.listen(8080);
console.log("The GraphQL Server is running.")
