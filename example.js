/**
 * EXAMPLE.js

 This file is an example of using the custom mongoose functions.
*/

const db = require('db-utils.js');
// IMPORT THE COLLECTIONS HERE

exports.doSomething = (res, req) => {

	const id = documentId;

	return Promise.all([
		db.findById('Collection', id)
	])
	.then(resp => {
		const data = resp[0].doc;

		// DO STUFF WITH data
	})
	.catch(err => {
		console.log(err);
	});
};
