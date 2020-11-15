const { isValidObjectId } = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

// Casting a string to an objectId and then checking that the original string matches the string value of the objectId
const isObjectId = (string: string) => {
  // If it has the same amount of chars that a ObjectId should have
  if (isValidObjectId(string)) {
    return new ObjectId(string) === string;
  }
  return false;
};

export default isObjectId;
