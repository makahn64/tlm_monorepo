import { addTimestamps } from './addTimestamps';
import { Timestamp } from 'firebase/firestore';

const longTimeAgo = new Timestamp(0, 0);
const lessLongAgo = new Timestamp(100, 0);

describe('Adding a timestamp to generic', () => {
  test('should add a createdAt and modifiedAt', () => {
    const car = { model: 'Fiat', year: 1982 };
    const stampedCar = addTimestamps(car);
    expect(stampedCar.createdAt).toBeDefined();
    expect(stampedCar.modifiedAt).toBeDefined();
  });

  test('should not modifiy createdAt but update modifiedAt', () => {
    const car = { model: 'Fiat', year: 1982, createdAt: longTimeAgo, modifiedAt: lessLongAgo };
    const stampedCar = addTimestamps(car);
    expect(stampedCar.createdAt).toBeDefined();
    expect(stampedCar.createdAt.seconds).toEqual(0);
    expect(stampedCar.modifiedAt).toBeDefined();
    expect(stampedCar.modifiedAt.seconds).not.toEqual(lessLongAgo.seconds);
  });
});
