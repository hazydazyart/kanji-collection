var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');
var mongoose = require('mongoose')

var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLList = graphql.GraphQLList;

var options = {
   connectTimeoutMS: 30000,
   useNewUrlParser: true,
   dbName: 'project'
};

var kanjiTypeGql = new GraphQLObjectType({
	name: "kanji",
	description: "data about kanji",
	fields: {
		literal: {
			type: GraphQLString,
			description: "The kanji character in UTF-8"
		},
		onyomi: {
			type: GraphQLList(GraphQLString),
			description: "Array of all onyomi"
		},
		kunyomi: {
			type: GraphQLList(GraphQLString),
			description: "Array of all kunyomi"
		},
		nanori: {
			type: GraphQLList(GraphQLString),
			description: "Array of all name readings"
		},
		gloss: {
			type: GraphQLList(GraphQLString),
			description: "Array of all English translations"
		},
		grade: {
			type: GraphQLString,
			description: "Grade level of kanji"
		},
		jlpt: {
			type: GraphQLString,
			description: "JLPT level of kanji"
		},
		frequency: {
			type: GraphQLString,
			description: "How common the kanji is"
		},
		stroke: {
			type: GraphQLString,
			description: "How many strokes is in kanji"
		}
	}
});

var kanjiSchema = new mongoose.Schema({
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
var kanjiCollection = mongoose.model('kanji', kanjiSchema, 'kanji');

function getKanjiByJlptLevel(level) {
	return kanjiCollection.find({jlpt: level})
		.then(function (docs) {
			return docs;
		})
		.catch(function (err) {
			console.log('err', err)
		})
}

function getKanjiByKunyomi(kun) {
	return kanjiCollection.find({kunyomi: kun})
		.then(function (docs) {
			return docs;
		})
		.catch(function (err) {
			console.log('err', err)
		})
}

var queryType = new GraphQLObjectType({
	name: "query",
	description: "Get by jlpt",
	fields: {
		getKanjiByJlptLevel: {
			type: GraphQLList(kanjiTypeGql),
			args: {
				level: {
					type: GraphQLString
				}
			},
			resolve: function(_, args) {
				return getKanjiByJlptLevel(args.level)
			}
		},
		getKanjiByKunyomi: {
			type: GraphQLList(kanjiTypeGql),
			args: {
				kunyomi: {
					type: GraphQLString
				}
			},
			resolve: function(_, args) {
				return getKanjiByKunyomi(args.kunyomi)
			}
		}
	}
});

var schema = new GraphQLSchema({
	query: queryType
});

var graphQLServer = express();
graphQLServer.use('/', graphqlHTTP({ schema: schema, graphiql: true }));
graphQLServer.listen(8080);
console.log("The GraphQL Server is running.")


// var kanjiType = new GraphQLObjectType({

// })

