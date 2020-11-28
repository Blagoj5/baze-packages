import { FilterXSS, IFilterXSSOptions } from 'xss';

// ES6 class
/**
 * @description Default options are: { css: false, stripIgnoreTagBody: ['script']}
 * @param  {defaultOptions} xssOptions - It accepts any options from https://github.com/leizongmin/js-xss module.
 * @method cleanData - Call cleanData(object) method to clean dirty data from an object
 */
class XSSClean {
  xssInstance: FilterXSS;
  constructor(xssOptions: IFilterXSSOptions) {
    this.xssInstance = new FilterXSS(xssOptions);
  }

  // Cleans arrays + objects recursively. If it's array SINCE it's for let in it will loop trough the numbers [0] [1] [2], if it's object it will loop trough ['key1'], ['key2']. So in any case it will clean the data.
  cleanData = (object: Record<string, any>): void => {
    for (let field in object) {
      // * Recursive way
      if (typeof object[field] === 'object') {
        //   Object (included array or object) is an refrence type. So every change will be done correctly
        this.cleanData(object[field]);
        continue;
      }
      if (typeof object[field] === 'string') {
        object[field] = this.xssInstance.process(object[field]);
      }
    }
  };
}

// module.exports = XSSClean;
// exports = XSSClean;
export default XSSClean;
