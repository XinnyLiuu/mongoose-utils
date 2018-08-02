### CUSTOM MONGOOSE UTILS

The purpose of these custom mognoose functions is to make the use of mongoose functions more informational.

Mongoose has too many similar functions such as **findOne**, **findOneAndRemove**, **findOneAndUpdate**, **update**, etc.

Normally, mongoose only outputs the default: **'{ n: 1, nModified: 1, ok: 1 }'**.

**This isnt useful for the programmer**. There really is no output we can use.

**These custom functions will return a object 'resp' with properties 'doc' and 'metadata'. The programmer can then access the data and modify it further. Additionally, the code can be customized to suit any projects means.**

INPUT ..
---
The functions will accept the parameters:
- resourceName (the mongodb collection)
- query
- opts ( NOTE: FOR SEARCH ONLY, additional parameters such as skip, limit, sort )

OUTPUT ..
---

These functions will utilize the mongoose functions, but create a custom object that will have the following properties:
- resp: ( short for the response aka. output )
	- doc/docs (contains the array of documents from the lookup)
		- doc: will be used for functions that modify one thing
		- docs: will be used for functions that modify mutilple
- metadata: (general information of the response)
	- found (# found)
	- returned: (# returned)
	- modified (# modified)

# Check the example.js file for an example of its usage
