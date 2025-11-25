const Utils = require('../../../functions/utils');

/*
 Returns an object like this.
 {
 active: number;
 lead: number;
 */

const bucketizeByClientType = (clients) => {

  const clientsWithoutTest = clients.filter(c => !c.email.includes('test.com'));

  const distilled = clientsWithoutTest.reduce((accum, client) => {
    const clientType = client.clientType;
    switch (clientType) {
      case 0: //active
        return {...accum, active: accum.active + 1};
      case 1: //paused
        return {...accum, paused: accum.paused + 1};
      case 2: //pastDue
        return {...accum, pastDue: accum.pastDue + 1};
      case 3: //lead
        return {...accum, lead: accum.lead + 1};
      case 4: //archived
        return {...accum, archived: accum.archived + 1};
      default:
        return {...accum, unknown: (accum.unknown || 0) + 1 };
    }
  }, {active: 0, paused: 0, pastDue: 0, lead: 0, archived: 0})
  return {
    ...distilled,
    totalCount: clientsWithoutTest.length
  };
}

module.exports = bucketizeByClientType;
