const admin = require('firebase-admin');

const removeUndefineds = (inputObj) => {
  const obj = {...inputObj};
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}

const daysBetweenDates = (date1, date2) => {
  const deltaSeconds = date1.getTime() - date2.getTime();
  return Math.ceil(deltaSeconds / (1000 * 3600 * 24));
}

function addTimestamps(obj) {
  const rval = { ...obj };
  const now = new admin.firestore.Timestamp(Math.floor(new Date().getTime() / 1000), 0);
  if (!obj.createdAt) {
    rval.createdAt = now;
  }
  rval.modifiedAt = now;
  return rval;
}

module.exports = {
  removeUndefineds,
  daysBetweenDates,
  addTimestamps
};
