import graphql from 'graphql';
//var {getKanjiByKunyomi, getKanjiByJlptLevel} = require('./queries.js')

const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;
const GraphQLList = graphql.GraphQLList;

const kanjiTypeGql = new GraphQLObjectType({
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

function getKanjiByJlptLevel(level, kanjiCollection) {
	return kanjiCollection.find({jlpt: level})
		.then(function (docs) {
			return docs;
		})
		.catch(function (err) {
			console.log('err', err)
		})
}

function getKanjiByKunyomi(kun, kanjiCollection) {
	return kanjiCollection.find({kunyomi: kun})
		.then(function (docs) {
			return docs;
		})
		.catch(function (err) {
			console.log('err', err)
		})
}

function getSchema(kanjiCollection) {
	var queryType = new GraphQLObjectType({
		name: "query",
		description: "Get Kanji",
		fields: {
			getKanjiByJlptLevel: {
				type: GraphQLList(kanjiTypeGql),
				args: {
					level: {
						type: GraphQLString
					}
				},
				resolve: function(_, args) {
					return getKanjiByJlptLevel(args.level, kanjiCollection)
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
					return getKanjiByKunyomi(args.kunyomi, kanjiCollection)
				}
			}
		}
	});

	return new GraphQLSchema({
		query: queryType
	});
}

export default getSchema;