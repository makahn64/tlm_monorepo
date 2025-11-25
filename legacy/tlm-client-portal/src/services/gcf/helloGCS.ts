
import { GCF_URL_BASE } from "./gcfCommon";

export const getPing = async () => {
  return fetch(`${GCF_URL_BASE}/whatUp`, {
    method: 'GET',
    headers: new Headers({'Accept': 'application/json'}),
  }).then( r => r.text() );
  //
  // // a 20x is cool
  // if (response.ok) {
  //   XLogger.logDebug(`TLM beta authorization for ${email} is cool.`);
  //   return true;
  // }

};
