import { Model, isValidObjectId, Schema } from 'mongoose';

class BazeQueryFormatter {
  paths: Record<string, any>;
  queryArray: object[];
  constructor(model: Model<any>) {
    this.paths = { ...model.schema.paths, ...(model.schema as any).subpaths };
    this.queryArray = [];
  }

  formatAllAttributes = (queryValue: any): (boolean | object)[] => {
    const arr = [];
    for (let path in this.paths) {
      const object = this.formatSingleAttribute(path, queryValue);
      if (object) {
        arr.push(object);
      }
    }
    this.queryArray = this.queryArray.concat(arr);
    return arr;
  };

  formatSingleAttribute = (path: string, value: any): object | boolean => {
    try {
      switch (this.paths[path].instance) {
        case 'Array':
          // * This is for the array if it's full with object ids. If it's just normal array i skip it because i get it's attributes in subPaths !!
          if (this.paths[path].$embeddedSchemaType.instance === 'ObjectID') {
            const valueWithoutSpace = value.replace(' ', '');
            if (isValidObjectId(valueWithoutSpace)) {
              return { [path]: valueWithoutSpace };
            }
          }
          return false;
        case 'Date':
          // * Because if i put new Date('3') it will return some date. So i need to make sure it's not just a plain number. Let's say for example 3 or 10 or 15. It needs to be full form like: '2020-10-12'. It would be nice to also allow let's say new Date('2020') only string with number like that but it's not consistant.
          // ! IM ALLOWING FOR ANY INTEGER TO TRANSFORM INTO DATE since i'm using $or Operator it won't make difference. (uncomment the if statement if you don't want to allow this case)
          // if (!Number.isInteger(+value)) {
          const date: Date = new Date(value);
          if (date.toString() !== 'Invalid Date') {
            return { [path]: { $lte: date } };
          }
          // }
          return false;
        case 'String':
          if (typeof value === 'string' && !Number.isInteger(+value)) {
            console.log(Number.isInteger(value));
            debugger;
            return { [path]: { $regex: value, $options: 'i' } };
          }
          return false;
        case 'ObjectID':
          // Second way of making sure you query if array is let's say array of ObjectIds
          // if (path.includes('.$')) {
          //   const originalField = path.replace('.$', '');
          //   continue;
          // }
          // isValidObjectId returns true for ('test t') for some reason. But when i merge them together into testt it causes no problems
          const valueWithoutSpace = value.replace(' ', '');
          if (isValidObjectId(value.replace(valueWithoutSpace))) {
            return { [path]: valueWithoutSpace };
          }
          return false;
        case 'Number':
          if (typeof value === 'number' || Number.isInteger(+value)) {
            return { [path]: parseInt(value) };
          }
          return false;
        case 'Decimal128':
          if (typeof value === 'number' || Number.isInteger(+value)) {
            return { [path]: parseFloat(value) };
          }
          return false;
        case 'Boolean':
          // If it's string but it's 'true' or 'false' or just a standard boolean
          if (
            typeof value === 'boolean' ||
            value === 'true' ||
            value === 'false'
          ) {
            //   value === 'true' will set true if it 'true' string or false if it's otherwise
            return {
              [path]: typeof value === 'boolean' ? value : value === 'true',
            };
          }
          return false;
        default:
          return false;
      }
    } catch (err) {
      console.log('Handled error', err.stack);
      return false;
    }
  };
}

export default BazeQueryFormatter;

/**
Some Tips about querying all:

// $regex doesn't work on ObjectID and Date, Number and Array with ObjectIds so i just ignore them, I can ignore all arrays which is bad, or i can just ignore if the caster of the array is ObjectId (this is what i do)

Because .paths.subString gives all the paths to embedded objects or array i don't need to do extra looping or recursive functions like i did in the past in the decrepted files

If you want directly change for some reason the paths or subPaths object you need to copy them and not change them like they are in this function ex. const subPaths = {...model.schema.paths}. Since i don't change anything inside them and use them only to build my query i don't need to copy them.
 */
