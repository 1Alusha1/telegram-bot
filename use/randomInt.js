let str = '';
export default function randomInt(countOfDigit) {
  str = '';
  for (let i = 0; i < countOfDigit; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
}
