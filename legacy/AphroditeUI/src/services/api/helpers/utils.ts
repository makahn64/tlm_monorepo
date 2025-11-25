import { sampleSize } from 'lodash';

const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
// 8 random characters should be fine for most uses
// returns something like COOL-A8de53A9
export function UUIDWith(preFix: string = ''){
  return `${preFix}-${sampleSize(chars,8).join('')}`;
}
