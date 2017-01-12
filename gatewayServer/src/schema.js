const axios = require('axios');
const {flatten} = require('lodash');
const config = require('../../config/config.privatekeys').amazon;
const AmazonSearch = require('./AmazonSearch');
const amazonSearch = new AmazonSearch(config);

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLFloat
} = require('graphql');

const CLListingType = new GraphQLObjectType({
  name: 'Listing',
  description: 'A representation of elastic search listing',
  fields: () => ({
    postId: { type: GraphQLString },
    postDate: { type: GraphQLString },
    postingUrl: { type: GraphQLString },
    title: { type: GraphQLString },
    price: { type: GraphQLString },
    cityName: { type: GraphQLString },
    imageUrls: { type: new GraphQLList(GraphQLString) }, //since it is an array you need to make it a constructo functioin for list and pass it graphqlstrings
    attributes: { type: new GraphQLList(GraphQLString) },
    lat: { type: GraphQLString }, //*** may need to be string
    long: { type: GraphQLString },
    postId: { type: GraphQLString },
    postingUrl: { type: GraphQLString },
    postDate: { type: GraphQLString },
    updateDate: {type: GraphQLString },
    attributes: { type: new GraphQLList(GraphQLString) },
    sellerUrl: { type: GraphQLString },
    sellerName: { type: GraphQLString },
    sellerPhoneNumber: { type: GraphQLString },
    sellerEmail: { type: GraphQLString },
    specs: { type: new GraphQLList(GraphQLString) },
    description: { type: GraphQLString },
  })
});

const HitsMetaData = new GraphQLObjectType({
  name: 'HitsMetaData',
  description: 'Meta data associated with a search',
  fields: () => ({
    total: { type: GraphQLInt },
    maxScore: {type: GraphQLFloat },
    timedOut: {type: GraphQLBoolean }
  })
});

const CLListingsHitResult = new GraphQLObjectType({
  name: 'ListingsHitResult',
  description: 'Representaiton of a complete elastic search listing result',
  fields: () => ({
    metaData: {type: HitsMetaData},
    results: {type: new GraphQLList(CLListingType)}
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query for graphql endpoint',
  fields: () => ({
    craigslist: {
      type: CLListingsHitResult,
      description: 'Keyword query to search',
      args: {
        query: {
          type: GraphQLString,
          description: 'Searches title for keywords separated by spaces'
        },
        descQuery: {
          type: GraphQLString,
          description: 'Searches description for keywords separated by spaces'
        },
        size: {
          type: GraphQLInt,
          description: 'The number of results to return'
        },
        from: {
          type: GraphQLInt,
          description: 'The starting point of the results to return'
        }
      },
      resolve: async (_, args) => {
        let request;
        try {
          let matchObj = {};
          if (args.query) matchObj['title'] = args.query;
          if (args.descQuery) matchObj['description'] = args.descQuery;
          let postReq = {
            'query': {
              'match': matchObj
            }
          };
          if (args.size) { postReq.size = args.size; }
          if (args.from) { postReq.from = args.from; }

          request = await axios.post('http://louispvb.com:9200/cl/listing/_search?pretty', postReq);
        } catch(error) {
          console.error('NonFatal: ' + error);
        }
        let results = request.data.hits.hits.map(listing => listing._source);
        let listingsHitResult = {
          metaData: {
            total: request.data.hits.total,
            maxScore: request.data.hits.max_score,
            timedOut: request.data.timed_out
          },
          results
        };
        return listingsHitResult;
      }
    },
    amazon: {
      type: new GraphQLList(GraphQLString),
      description: 'List of amazon products',
      args: {
        query: {
          type: GraphQLString,
          description: 'Keywords to search on Amazon'
        },
        SearchIndex: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The category to search for, see following link for list of categories: http://docs.aws.amazon.com/AWSECommerceService/latest/DG/localevalues.html'
        },
        Brand: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        let allResults = [];
        let requests = [];

        // Batch 10 searches to get 10 amazon result pages
        for (let i = 1; i <= 10; i++) {
          let searchOpts = {
            SearchIndex: args.SearchIndex,
            Keywords: args.query,
            ResponseGroup: 'ItemAttributes',
            ItemPage: i,
          };
          if (args.Brand) searchOpts.brand = args.Brand;
          requests.push(amazonSearch.itemSearch(searchOpts));
        }

        // Execute search requests in parralel
        let datas;
        try {
          datas = await Promise.all(requests);
        } catch (error) {
          console.error('NonFatal: ', error);
        }

        // Return flattened URLS
        return flatten(datas.map(data =>
          data[0].Item.map(item =>
            item.DetailPageURL[0].split('%3FSubscription')[0])));
      }
    }
  })
});

const schema = new GraphQLSchema({ query: Query });

module.exports = schema;
