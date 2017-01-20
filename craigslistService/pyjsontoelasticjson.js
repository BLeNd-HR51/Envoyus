var fs = require('fs');

// run this file using `node pyjsontoelasticjson.js` to ge the JSON file in the below form
// { "index": { "_index": "cl", "_type": "listing" }
// {/* Craigslist Listing data */}
// { "index": { "_index": "cl", "_type": "listing" }
// {/* Craigslist Listing data */}

// see link
// https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html

var json = fs.readFileSync('macbook-sfbay.json');
json = JSON.parse(json.toString());
//{"index":{"_id": String(i)}}) + '\n' +
var newjson = json.map((listing, i) =>
  JSON.stringify({ "index": { "_index": "cl", "_type": "listing" }}) + '\n' + JSON.stringify(listing)).join('\n');

fs.writeFileSync('finalMacBookProSF.json', newjson)
// run curl with file name in terminal
// curl -s -XPOST localhost:9200/_bulk --data-binary @final.json
// curl -XDELETE localhost:9200/cl
