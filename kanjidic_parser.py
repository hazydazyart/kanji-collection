import lxml.etree as ET
from pymongo import MongoClient
from pprint import pprint

client = MongoClient('mongodb://localhost:27017')
db = client.project

kanji_collection = db.kanji

tree = ET.parse("kanjidic2.xml")

root = tree.getroot()

for child in root.findall('character'):
	on_yomi = []
	kun_yomi = []
	transl = []
	nanori = []
	literal = child.find('literal').text

	for node in child.findall('./misc/grade'):
		grade = node.text

	for node in child.findall('./misc/stroke_count'):
		stroke_count = node.text

	for node in child.findall('./misc/jlpt'):
		jlpt = node.text

	for node in child.findall('./misc/freq'):
		frequency = node.text

	for node in child.findall('./reading_meaning/rmgroup/reading[@r_type=\'ja_on\']'):
		on_yomi.append(node.text)

	for node in child.findall('./reading_meaning/rmgroup/reading[@r_type=\'ja_kun\']'):
		kun_yomi.append(node.text)

	for node in child.findall('./reading_meaning/rmgroup/meaning'):
		if 'm_lang' not in node.attrib:
			transl.append(node.text)

	for node in child.findall('./reading_meaning/nanori'):
		nanori.append(node.text)

	entry = {
		'literal': literal,
		'onyomi': on_yomi,
		'kunyomi': kun_yomi,
		'gloss': transl,
		'nanori': nanori,
		'grade': grade,
		'jlpt': jlpt,
		'stroke': stroke_count
	}

	kanji_collection.insert_one(entry)