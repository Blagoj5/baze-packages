import { isObject } from './utilities';

/**
 * @description It parses an object so it can be used as a query inside .findOne or find etc etc. Example: **{
        social: { id: '5013469412003852', provider: 'facebook' },
        test: { tester: { da: 'da', ne: 'ne' }, molam: 'molam' },
    } -------------------------------------->
    {
    'social.id': '5013469412003852',
    'social.provider': 'facebook',
    'test.tester.da': 'da',
    'test.tester.ne': 'ne',
    'test.molam': 'molam'
    } 
 * @param  {Object} object, the object that will be parsed. Transformed from {sth: {foo: 'queryThis'}} into {'sth.foo': 'queryThis'}
 */

export const parseObject = (
  object: Record<string, any>
): Record<string, any> => {
  let newObject: Record<string, any> = {};
  for (let property in object) {
    if (isObject(object[property])) {
      // Recursive
      const deepObject = parseObject(object[property]);
      for (let deepAtt in deepObject) {
        newObject[`${property}.${deepAtt}`] = deepObject[deepAtt];
      }
      continue;
    }
    newObject[property] = object[property];
  }
  return newObject;
};
