import React, { FC } from 'react';
import bkg from "../../../assets/images/client_portal_bkg_1.jpg";
import {ClientPortalNavbar} from "../../../components/navigation/ClientPortalNavbar";

interface Props {}

export const ClientPortalContainer: FC<Props> = ({ children}) => {
  return (
    <div style={styles.container}>
      <ClientPortalNavbar/>
      { children }
    </div>
    );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vw'
    // backgroundImage: `url(${bkg})`,
    // backgroundSize: 'cover'
  }
}
