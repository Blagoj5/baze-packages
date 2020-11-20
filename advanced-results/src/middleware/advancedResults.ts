import BazeQueryFormatter from './utils/BazeQueryFormatter';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { parseObject } from '../utils/mongooseObjectParser';
import asyncHandler from './asyncHandler';
import chalk from 'chalk';

interface Pagination {
  pages?: number;
  total?: number;
  maxDocuments?: number;
  next?: {
    nextPage?: number;
    page?: number;
  };
  prev?: {
    prevPage?: number;
    page?: number;
  };
  current?: number;
  limit?: number;
}

interface AdvancedResults {
  success: boolean;
  count: number;
  pagination: Pagination;
  data: any[];
}

// Im handling cases for queryes like: ?name[regex]=Bla and NOT ?name[$regex]=Bla, so i can prevent nosql injection. Because im using express-mongo-sanitize and what it does is all cases where there's $ transformers them in something else so no injection can be done
/**
 * @description Full description and doc about this middleware: https://www.npmjs.com/package/advanced-results
 * @param  model - the model for which the advanced filtering will be done
 * @param  populate - field(String) or fields(Array) that you want to populate
 * @param  param - if except the query, you want the advancedResults to be done by certain paramatear from url. Expecting: ['user', 'userId'](the first is the FIELD NAME for which the query from the parametar will refrence to, and the second is the PARAMETAR NAME in the url ('/reviews/:trainingProgramId/dada). Example: Review.find({[param[0]]: req.params[param[1]]}) is same as Review.find({user: userId}))
 */
const advancedResults = (
  model: Model<any>,
  populate?: string | string[],
  param?: [string, string],
  consoleIt: Boolean = false
) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      // In case it sends 2 requests for favicon.ico
      if (req.url === '/favicon.ico') {
        return next();
      }

      let query;

      //   In a case if someone enters /athletes?bio[regex]=David+Laid, without defining option like ?bio[regex]=David+Lai&bio[options]=i, making the regex case-insensitive by DEFAULT
      for (let qr in req.query) {
        const possibleValues = req.query[qr] as {
          regex?: string;
          in: string;
        };
        debugger;
        if (possibleValues.regex) {
          // Make sure it's a string, if it's not a string then it should not  have [regex] field inside of it
          if ((model.schema.paths[qr] as any).instance === 'String') {
            // If there are no options provided in the url by default add i
            if (!(req.query[qr] as any).options) {
              (req.query[qr] as any).options = 'i';
            }
          } else {
            delete req.query[qr];
          }
        }

        if (possibleValues.in) {
          // Splitting if there's in query into an array so the query can be done the proper way $in: ['Hypertrophy', 'Strength']

          (req.query[qr] as any).in = possibleValues.in.split(',');
        }
      }
      //   Copy req.query
      const reqQuery = { ...req.query };

      //   Fields to exclude
      const removeField = [
        'select',
        'sort',
        'limit',
        'page',
        'all',
        'filter',
        'q',
      ];

      //   Loop over removeField and delete from reqQuery
      removeField.forEach((param) => delete reqQuery[param]);

      //   Create query string
      let queryString = JSON.stringify(reqQuery);

      //   Create operators ($gt, $gte ,etc)
      queryString = queryString.replace(
        /\b(gt|gte|in|lt|lte|eq|regex|options)\b/g,
        (match) => `$${match}`
      );

      // Calling my object of my custom Class for setting up global/advanced/all query
      const formatter = new BazeQueryFormatter(model);

      // Implementing the whole filter system required for react-admin. This is also actually a good way to query bakcend by. So the whole idea is having a filter object in query example for athlete: filter: '{"name": "dave","all": "dav"}', so by doing this i elimnite the whole need to remove fields that i dont want to query (like above)
      // Check for filter (This is a query i get from react-admin, so i need to make it work with my advancedResults middleware)
      let filter: Record<string, any> = {};
      const filterArr = [];

      if (req.query.filter) {
        // query.filter is an stringified object so i need to parse it before i do anything
        filter = JSON.parse(req.query.filter as string);

        // Check for q query which is the same as all
        if (filter['q']) {
          filter.all = filter['q'];
          delete filter['q'];
        }
        // I must handle the all case, i populate the req.query.all with the filter.all value, so in the (if statement) below it fetches and queries by every possible field in the Model
        if (filter.all) {
          req.query.all = req.query.all
            ? req.query.all + ` ${filter.all}`
            : filter.all;

          delete filter.all;
        }
        // I don't want the querying to be exact ex. name: 'David Laid'. I want to be flexible ex. name: 'dav', and to show all names that have dav in them. So i must use regex on all properties inside filter
        // parseObject is making the object to be in valid format for querying in mongodb. Example: {name: 'David', someObject: {att1: 'da'}} -----> {name: 'David', 'someObject.att1': 'da'}
        const parsedFilter = parseObject(filter);
        for (let qr in parsedFilter) {
          // Because parseObject transform everything into lets say {a: {b:'b', c: 'c'}} -> {a.b: 'b', a.c: 'c'}. There's a problem with react-admin because for a field that is ObjectID it sends me data like this: category: {_id: 'asdasdsa312312'} which is transformed into {'category._id': 'asdasdsadsa123'} by parseObject, instead of {category: 'asdsadassadas123'}
          // So what i do: this {'category._id': 'asdasdsadsa123'} i transform it with .replace funtion into {'category': 'asdasdsadsa123'}. And everything will work fine
          // Will get formatted object or false
          // const object = formatter.formatSingleAttribute(
          //   qr.replace('._id', ''),
          //   parsedFilter[qr]
          // );
          const object = formatter.formatSingleAttribute(
            qr.includes('._id') ? qr.replace('._id', '') : qr,
            parsedFilter[qr]
          );
          if (object) {
            filterArr.push(object);
          }
          // Delete if it's an empty object
          if (
            filter[qr] instanceof Object &&
            Object.keys(filter[qr]).length <= 0
          ) {
            delete filter[qr];
          }
        }

        // Refresh filter, and make it adapt to the $and syntax with array so like {$and: [{this: sth}]} instead of {this: sth} (Both cases are fine but since i use my custom function this way is easier)
        if (filterArr.length > 0) {
          filter = {};
          filter.$and = filterArr;
        }
      }

      // DEFINING GLOBAL SEARCH QUERY on req.query.all - this works on all attributes of model, used for global search inputs from frontend
      const allQuery: Record<string, any> = {};
      if (req.query.all || req.query.q) {
        // They might be predefined from the statement above
        // Copying all attributes of this model

        // If there's something like let's say req.query.all=David Laid Push, everytime the query will be EMPTY because it uses inside of $regex: 'David Laid Push', FOR THAT REASON i need to split the words in ARRAY AND DO QUERY(regex) FOR EVERY WORD that is typed with whitespace
        let words: string[] = [];
        let wordsString = '';

        // In case all parametar is ?all=dsadas%20 ---> all = 'dsadas '. And when i do .split(' ') it makes 2 words the actual word which is dsadas and the empty space ---> ['dsadas', '']; This is bad so i need to trim the ends and beginning of that string
        // In case query is all=Sth+sth
        if (req.query.all) {
          req.query.all = (req.query.all as string).trim();
          words = words.concat((req.query.all as string).split(' '));
          wordsString = wordsString + req.query.all;
        }
        // In case query is q=Sth+sth
        if (req.query.q) {
          req.query.q = (req.query.q as string).trim();
          words = words.concat((req.query.q as string).split(' '));
          wordsString = wordsString + req.query.q;
        }

        // **NEWEST VERSION**
        // For every word that is seperated by space in the url do regex
        for (let word of words) {
          // This function validates attribute depening on if it's date/objectId/number or normal string (for normal string uses $regex for others not) and pushes to the provided array
          formatter.formatAllAttributes(word);
        }

        // Creating new queries that the model.find({}) will be executed for
        let allQueryArr = formatter.queryArray;

        // At the end add all words to every possible attribute, it might make sense in some cases like duration: 1 Week instead of just seprate words duration: 1 and duration: Week. wordsString is string version of all words that need to be query; This will happen if there are multiple words
        if (words.length > 1) {
          // This will concat the new query format for all words the the array inside that object
          formatter.formatAllAttributes(wordsString);
          allQueryArr = formatter.queryArray;
        }
        // By default all the queries are with $and, so  i need to do convert them with $or since this is general query, it works { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
        allQuery.$or = allQueryArr;
      }

      // I need to handle filter query field for react-admin

      // Merging the global all query (if there's one) and the basic query that i get from url or from the filter object
      const finalQuery: Record<string, any> = {
        ...JSON.parse(queryString),
        ...allQuery,
        ...filter,
      };
      if (consoleIt) {
        console.log(
          chalk.green(
            `Advanced Results middleware will find documents for model ${model.modelName} with query: %O`
          ),
          JSON.stringify(finalQuery)
        );
      }
      // Adding also parametar in the final query if there's one, because some of my routes work that way ex. /api/v1/training-programs/:trainingProgramId/days (it fetches all days with that trainingProgramId). Also can be handled with /api/v1/days?trainingProgram=asdasdasd123123asdas (and passed in the filter field above or just like the example in a normal way in url)
      if (param && req.params[param[1]]) {
        finalQuery[param[0]] = req.params[param[1]];
      }
      //   Finding resource
      query = model.find(finalQuery);

      //   Select field
      if (req.query.select) {
        const fields = (req.query.select as string).split(',').join(' ');
        query = query.select(fields);
      }

      //   Sort field
      if (req.query.sort) {
        const sortBy = (req.query.sort as string).split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }

      // Pagination
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 6;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      query = query.skip(startIndex).limit(limit);
      // This is the total by a certain query/filter
      const total = await model.countDocuments(finalQuery);
      // This is the total in general without filter
      const maxDocumentsWithoutFilter = await model.estimatedDocumentCount();

      // Pagination result
      const pagination: Pagination = {};

      // Adding max how many pages are there with the certain filtering (I need this for some pages)
      pagination.pages = Math.ceil(total / limit);
      pagination.total = total;
      pagination.maxDocuments = maxDocumentsWithoutFilter;

      if (endIndex < total) {
        pagination.next = {
          nextPage: (page + 2) * limit <= total ? page + 2 : undefined,
          page: page + 1,
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          prevPage: page - 2 > 0 ? page - 2 : undefined,
          page: page - 1,
        };
      }

      // Everytime it will show the current page, it doesn't metter if it has limit or not
      pagination.current = page;
      pagination.limit = limit;

      //  Populating the fields
      if (populate) {
        // In case populate is an array an has multiple populate values inside of it
        if (Array.isArray(populate)) {
          for (let val of populate) {
            query = query.populate(val);
          }
        } else {
          query = query.populate(populate);
        }
      }
      debugger;
      const results: Document[] = await query;

      ((res as any).advancedResults as AdvancedResults) = {
        success: true,
        count: results.length,
        pagination,
        data: results,
      };
      if (consoleIt) {
        console.log(
          chalk.greenBright('Final response object, res.advancedResults: '),
          (res as any).advancedResults
        );
      }
      return next();
    }
  );
};

export = advancedResults;
