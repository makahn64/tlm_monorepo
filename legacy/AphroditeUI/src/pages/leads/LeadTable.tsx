import React, {FC} from 'react';
import {Lead} from "../../types/Lead";
import {Table} from 'react-bootstrap';

interface Props {
  lead: Lead;
}

export const LeadTable: FC<Props> = ({lead}) => {

  // pre, post, trying
  const leadState = lead!.profile!.pregState!;

  return (
    <Table>
      <tbody>
      <tr>
        <td className="text-muted">Email</td>
        <td>{lead!.contactInfo!.email}</td>
      </tr>
      <tr>
        <td className="text-muted">First Name</td>
        <td>{lead!.contactInfo!.firstName}</td>
      </tr>
      <tr>
        <td className="text-muted">LastName</td>
        <td>{lead!.contactInfo!.lastName}</td>
      </tr>
      <tr>
        <td className="text-muted">Added On</td>
        <td>{new Date(lead!.createdOn!).toDateString()}</td>
      </tr>
      <tr>
        <td className="text-muted">Pregnancy State</td>
        <td>{lead?.profile?.pregState}</td>
      </tr>
      {leadState !== 'trying' ?
        <>
          <tr>
            <td className="text-muted">Birth Type</td>
            <td>{lead.profile?.birthType ? lead.profile?.birthType : 'n/a'}</td>
          </tr>
          <tr>
            <td className="text-muted">Pelvic Pain</td>
            <td>{lead?.profile?.pelvicPain?.join(',')}</td>
          </tr>
          <tr>
            <td className="text-muted">Pelvic Floor Concerns</td>
            <td>{lead?.profile?.pelvicFloorConcerns?.join(',')}</td>
          </tr>
          <tr>
            <td className="text-muted">Diastisis Recti</td>
            <td>{lead?.profile?.diastasisRecti}</td>
          </tr>
          <tr>
            <td className="text-muted">Back Pain</td>
            <td>{lead?.profile?.backPain}</td>
          </tr>
          <tr>
            <td className="text-muted">Sciatica</td>
            <td>{lead?.profile?.sciatica}</td>
          </tr>
          <tr>
            <td className="text-muted">Round Ligament Pain</td>
            <td>{lead?.profile?.sciatica}</td>
          </tr>
        </> : undefined}
      <tr>
        <td className="text-muted">Medical Conditions</td>
        <td>{lead?.profile?.medicalConditions}</td>
      </tr>
      <tr>
        <td className="text-muted">Previous Injuries</td>
        <td>{lead?.profile?.previousInjuries}</td>
      </tr>
      <tr>
        <td className="text-muted">Most Interested In</td>
        <td>{lead?.profile?.mostInterestedIn?.join(',')}</td>
      </tr>
      <tr>
        <td className="text-muted">Anything Else</td>
        <td>{lead?.profile?.anythingElse}</td>
      </tr>
      </tbody>
    </Table>
  );
};
