import React, {CSSProperties, FC} from 'react';
import { FaAddressCard, FaDumbbell, FaClipboard, FaArrowAltCircleDown, FaHistory } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons/lib';
import {THEME_COLORS} from "../../assets/styles/themecolors";
import { useHistory } from 'react-router-dom';

interface Props {
  icon: React.FC<IconBaseProps>;
  to?: string;
  color: string;
  label: string;
  subtitle?:string;
}

export const IconTile: FC<Props> = ({icon, label,to, color, subtitle}) => {

  const Icon = icon;
  const history = useHistory();

  return (
    <div style={styles.container} className="actioncard flex-column d-inline-flex m-3"
     onClick={()=>{
       if (to) {
         history.push(to);
       }
     }}>
      <Icon style={{ fontSize: 100, color}} className="align-self-center mr-2"/>
      <span className="align-self-center mr-2 text-white mt-2" style={styles.label}>{label}</span>
      { subtitle ? <span style={styles.subtitle}>{subtitle}</span> : null }
    </div>
  );
};

const styles = {
  container: {
    width: 250,
    height: 250,
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'center'
  } as CSSProperties,
  subtitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12
  } as CSSProperties
}

export const AccountIconTile = (props: Partial<Props>) =>
  IconTile({label: "Profile", icon: FaAddressCard, color: 'white', ...props});
export const DumbbellIconTile =(props:Partial<Props>) =>
  IconTile({icon: FaDumbbell, label: "Add Workout", color: "white", ...props });
export const RecommendationIconTile =(props:Partial<Props>) =>
  IconTile({icon: FaArrowAltCircleDown, label: "Send Info", color: "white", ...props });
export const NotesIconTile =(props:Partial<Props>) =>
  IconTile({icon: FaClipboard, label: "Client Notes", color: "white", ...props });
export const HistoryIconTile =(props:Partial<Props>) =>
  IconTile({icon: FaHistory, label: "Workout History", color: "white", ...props });
