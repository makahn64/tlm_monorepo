// import {Client, Equipment} from "../types";
// import {InjuryOrCondition, Posture} from "../types";

// export function mapV0toV1(c: Client): Client {
//   const postureConditions: Posture[] = c.posture ? [c.posture as Posture] : ['neutral'];
//   const injuries: InjuryOrCondition[] = [];
//   const equipment: Equipment[] = [];
//   // injuries
//   if (c.isProlapse) injuries.push('prolapse');
//   if (c.isInjuredNeck) injuries.push('neck');
//   if (c.isInjuredShoulder) injuries.push('shoulder');
//   if (c.isPainPubic) injuries.push('pubicPain');
//   if (c.isDr) injuries.push('dr');
//   if (c.isCarpalTunnel) injuries.push('carpalTunnel');
//   if (c.isPainGroin) injuries.push('groinPain');
//   if (c.isInjuredAnkle) injuries.push('ankle');
//   if (c.isPainSacrum) injuries.push('sacrumPain');
//   if (c.isInjuredHip) injuries.push('hip');
//   if (c.isHypertonic) injuries.push('hypertonic');
//   if (c.isLeakage) injuries.push('leakage');
//   if (c.cSection && c.cSection === 'yes') injuries.push('csection');
//   if (c.isRoundLigament) injuries.push('roundLigament');
//   // equipment
//   if (c.hasLoopedBand) equipment.push('loopedBand');
//   if (c.hasWall) equipment.push('wall');
//   if (c.hasBall) equipment.push('ball');
//   if (c.hasBodyWeight) equipment.push('bodyWeight');
//   if (c.hasStep) equipment.push('step');
//   if (c.hasFoamRoller) equipment.push('foamRoller');
//   if (c.hasKettlebell) equipment.push('kettlebell');
//   if (c.hasMat) equipment.push('mat');
//   if (c.hasChair) equipment.push('chair');
//   return {...c, postureConditions, injuries, equipment, schemaVersion: 1};
// }
