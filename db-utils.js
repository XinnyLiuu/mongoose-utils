/**
 *
	CUSTOM MONGOOSE UTILS

	 The purpose of these custom mognoose functions is to make the use of mongoose functions more informational.

	 Mongoose has too many similar functions such as findOne, findOneAndRemove, findOneAndUpdate, update, etc.

	 Normally, mongoose only outputs the default: '{ n: 1, nModified: 1, ok: 1 }'.

	 This isnt useful for the programmer. There really is no output we can use. These functions will return a object 'resp' with properties 'doc' and 'metadata'. The programmer can then access the data and modify it further. Additionally, the code can be customized to suit any projects means.

	 INPUT --
	 The functions will accept the parameters:
	 - resourceName (the mongodb collection)
	 - query
	 - opts ( NOTE: FOR SEARCH ONLY, additional parameters such as skip, limit, sort )

	 OUTPUT --
	 These functions will utilize the mongoose functions, but create a custom object that will have the following properties:
	 - resp: ( short for the response aka. output )
			- doc/docs (contains the array of documents from the lookup)
				- doc: will be used for functions that modify one thing
				- docs: will be used for functions that modify mutilple
	 - metadata: (general information of the response)
	  	- found (# found)
			- returned: (# returned)
			- modified (# modified)
 */

'use strict';
const mongoose = require('mongoose');
require('../models'); // These will be passed into mongoose

module.exports = {
 findById, // get (one)
 search, // get (many)
 updateById, // put (one)
 createDoc, // post (one),
 removeById, // delete (one)
};

// Get collection
function getModel(resourceName) {
 return mongoose.model(resourceName);
};

// Finds a document by Id, Returns 1
function findById(resourceName, id) {

	const collection = getModel(resourceName);

	return Promise.all([
		collection.findOne({ _id: id })
	])
	.then(data => {

		const found = data.length;
		const resp = {
			doc: data[0],
			metadata: {
				found: found,
				returned: found
			}
		};

		return resp;
	})
	.catch(err => {
		console.log(err);
		console.log("db.findById error");
	});
};

// Finds mutilple documents based on query, returns many
function search(resourceName, query, opts) {

	// If there are no queries or options, just set to blank object
	if (!query) query = {};
	if (!opts) opts = {};

	const collection = getModel(resourceName);

	const skip = opts.skip || 0;
	const limit = opts.limit || 0;
	const sort = opts.sort || {};

	return Promise.all([
		collection.find(query).sort(sort).skip(skip).limit(limit).exec(),
		collection.find(query).count()
	])
	.then(data => {

		const num_returned = data[0].length;
		const num_found = data[1];
		const nextOffset = skip + num_returned;

		const resp = {
			docs: data[0],
			metadata: {
				found: num_found,
				returned: num_returned
			}
		};

		// Catch for cases if we go out of bounds for the number of elements that were found
		if (nextOffset < num_found ) {
			resp.metadata.nextOffset = nextOffset;
		};

		return resp;
	})
	.catch(err => {
		console.log(err);
		console.log('db.search error');
	});
};

// Updates based on Id by query, returns 1
function updateById(resourceName, query, update) {

	const collection = getModel(resourceName);
	delete update._id; // Do not allow users to update ._id of a document

	return collection.findOneAndUpdate(query, mongoUpdate, { new: true }) // new is set to true, as opposed to the default
	.then(data => {

		const resp = {
			doc: data,
			metaData: {
				found: data.length,
				returned: data.length,
				modified: data.length
			}
		};
	})
	.catch(err => {
		console.log(err);
		console.log("db.updateById error");
	});
};

// Creates a document based on obj defined, returns 1
function createDoc(resourceName, obj) {
	delete obj._id; // Do not allow users to set ._id

	const collection = getModel(resourceName);
	const item = new collection(obj);

	return item.save()
	.then(data => {

		const resp = {
			doc: data,
			metadata: { modified: data.length}
		};

		return resp;
	})
	.catch(err => {
		console.log(err);
		console.log("db.createDoc error");
	});
};

// Removes a document based on Id, returns 1
function removeById(resourceName, id) {

	const collection = getModel(resourceName);

	return collection.findOneAndRemove({_id: id})
	.then(data => {

		const resp = {
			doc: data,
			metadata: {
				modified: data.length;
			};
		};
	})
	.catch(err => {
		console.log(err);
		console.log("db.removeById error");
	});
};
