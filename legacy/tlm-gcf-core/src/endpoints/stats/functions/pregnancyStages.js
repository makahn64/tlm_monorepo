const Utils = require('../../../functions/utils');

/*
 Returns an object like this:
 {
  firstTrimester: number;
  secondTrimester: number;
  thirdTrimester: number;
  recentPostPartum: number;
  postPartum: number;
 */

const bucketizeByStage = (clients) => {

  const clientsWithoutTest = clients.filter( c => !c.email.includes('test.com'));
  const clientsWithDueDates = clientsWithoutTest.filter( c => c.dueDate);

  const distilled = clientsWithDueDates.reduce((accum, client) => {
    // isPregnant is a boolean
    // dueDate is a zulu date string

    const deltaDays = Utils.daysBetweenDates(new Date(), new Date(client.dueDate));
    if (client.isPregnant || deltaDays > 0) {
      if (deltaDays > 180) {
        return {...accum, firstTrimester: accum.firstTrimester + 1};
      } else if (deltaDays > 90) {
        return {...accum, secondTrimester: accum.secondTrimester + 1};
      } else {
        return {...accum, thirdTrimester: accum.thirdTrimester + 1};
      }
    } else {
      if (deltaDays > -42) {
        // less than 6 weeks PP
        return {...accum, recentPostPartum: accum.recentPostPartum + 1};
      }
      return {...accum, postPartum: accum.postPartum + 1};
    }
  }, {
    firstTrimester: 0,
    secondTrimester: 0,
    thirdTrimester: 0,
    recentPostPartum: 0,
    postPartum: 0
  })
  return {...distilled,
    totalCount: clientsWithoutTest.length,
    unknown: clientsWithoutTest.length - clientsWithDueDates.length
  };
}

module.exports = bucketizeByStage;
