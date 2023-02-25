import { alphaNumericComparator } from './helper';

describe('helper unit tests',() => {
  it('(alphaNumericArray.sort(alphaNumericComparator)) works returning correctly sorted array ',() => {
    const alphaNumericArray = ['a0001ama-4404', 'asdmads-212-2121.kareem.info', 'dallas.biz',  'a0001.biz', 'a0000.biz'];
    expect(alphaNumericArray.sort(alphaNumericComparator)).toEqual(['a0000.biz','a0001.biz','a0001ama-4404','asdmads-212-2121.kareem.info','dallas.biz']);
  });
  it('(alphaNumericArray.sort(alphaNumericComparator)) works returning correctly sorted array ii ',() => {
    const alphaNumericArray = ['1000b', '1001a', '0001a'];
    expect(alphaNumericArray.sort(alphaNumericComparator)).not.toEqual(['1000b', '1001a', '0001a']);
    expect(alphaNumericArray.sort(alphaNumericComparator)).not.toEqual(['0001a', '1001a','1000b' ]);
  });
});
