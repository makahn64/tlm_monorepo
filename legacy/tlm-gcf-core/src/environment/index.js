
let environment = 'local';
const LEGIT_ENVS = ['local', 'development', 'staging', 'production', 'legacy'];

const ENVIRONMENTS = {
  legacy: {
    videoBucketServiceAccount: './serviceAccounts/legacy/tlm-classic-service-account',
    videoBucketName: 'thelotusmethod-phase2',
    projectServiceAccount: './serviceAccounts/legacy/tlm2021-service-account',
    databaseUrl: "https://tlmaphrodite.firebaseio.com"
  },
  local: {
    videoBucketServiceAccount: './serviceAccounts/legacy/tlm-classic-service-account',
    videoBucketName: 'thelotusmethod-phase2',
    projectServiceAccount: './serviceAccounts/legacy/tlm2021-service-account',
    databaseUrl: "https://tlmaphrodite.firebaseio.com"
  },
}

const setEnvironment =  (env) => {
  if (!env) {
    console.log('No environment set, using development');
    return;
  }
  if (LEGIT_ENVS.includes(env)){
    environment = env;
  } else {
    throw new Error(`Attempted set environment to an invalid choice ${env}`);
  }
}

const getProjectServiceAccount = () => {
  return require(getEnvironment().projectServiceAccount);
}

const getEnvironment = () => ENVIRONMENTS[environment];

module.exports = {
  setEnvironment,
  getEnvironment,
  getProjectServiceAccount

}
