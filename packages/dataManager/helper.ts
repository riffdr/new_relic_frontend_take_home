/**
 * Provides alphanumeric comparison for string Arrays, to be used like this:
 * YOUR_ARRAY.sort(alphaNumericComparator)
 * @param a
 * @param b
 */
export const alphaNumericComparator = (a:any, b:any) => {
  return a.toString().localeCompare(b.toString(), 'en', { numeric: true })
};

/**
 * Provides alphanumeric comparison
 * @param list an { [key: string]: any; } Object
 * Returns a new Object with its keys ordered alphanumerically
 */

export const sortObjectListByKeys = (list: { [key: string]: any; }):any => {
  const objectKeys = Object.keys(list).sort(alphaNumericComparator);
  let newList:any = {};
  for (let i = 0; i < objectKeys.length; i++) {
    const key:string = objectKeys[i];
    newList[key] = list[key];
  }
  return newList;
};
