/**
 * @param object any value that will be checked whenever it's strict object (not array)
 */
export const isObject = (object: any): boolean => {
  return (
    object === Object(object) &&
    Object.prototype.toString.call(object) !== '[object Array]'
  );
};
