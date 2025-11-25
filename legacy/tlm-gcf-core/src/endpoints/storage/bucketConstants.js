const { setEnvironment, getEnvironment, getProjectServiceAccount } = require('../../environment');

const {Storage} = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({keyFilename: 'src/endpoints/storage/tlm-classic-service-account.json'});
const BUCKET = 'thelotusmethod-phase2';

const storage2022 = new Storage({keyFilename: 'src/environment/serviceAccounts/legacy/tlm2021-service-account.json'});
const MEDIA_BUCKET_2022 = 'tlm-media-2022';

module.exports = { storage, BUCKET, storage2022, MEDIA_BUCKET_2022 };
