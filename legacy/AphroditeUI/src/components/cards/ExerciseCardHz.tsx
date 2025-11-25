import React, {CSSProperties, FC} from 'react';
import {gcsUrlForFileName} from "../../services/gcf/gcsUrlForFileName";
import exerciseImg from '../../../src/assets/images/exercise.png';
import breakImg from '../../../src/assets/images/break.png';
import {Exercise} from "tlm-common";
import {BsPencilSquare} from 'react-icons/bs';
import {useLongPress} from "use-long-press";

interface Props {
  exercise: Exercise;
  onClick?: (e: Exercise) => void;
  onDoubleClick?: (e: Exercise) => void;
  onLongPress?: (e: Exercise) => void;
  title?: string;
  deleting?: boolean;
  onAddNotes?: () => void;
  index?: number;
}

export const ExerciseCard: FC<Props> = ({
                                          title,
                                          exercise,
                                          onClick,
                                          deleting = false,
                                          onAddNotes,
                                          index,
                                          onDoubleClick,
                                          onLongPress
                                        }) => {

  const thumbName = (exercise as Exercise).prenatalThumb.name;
  let url = (exercise.name !== 'break') ? exerciseImg : breakImg;
  if (thumbName) {
    url = gcsUrlForFileName(thumbName);
  }

  const bind = useLongPress(() => {
    if (onLongPress) onLongPress(exercise);
  });

  const containerClass = `d-flex m-1 floatingcard-lite ${deleting ? "animate__animated animate__backOutRight" : ""}`;

  const handleOnClick = () => {
    if (onClick) onClick(exercise);
  }

  const handleOnDoubleClick = () => {
    if (onDoubleClick) onDoubleClick(exercise);
  }

  return (
    <div className={containerClass} onClick={handleOnClick} onDoubleClick={handleOnDoubleClick} {...bind} >
      <img src={url} style={styles.image}/>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 10, width: '100%'}}>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
          width: '100%'
        }}>
          <div>{exercise.name.replace(/[-_]/gm, ' ').toLowerCase()}</div>
          <div>{onAddNotes ? <BsPencilSquare onClick={onAddNotes} className="mr-2"/> : ''}</div>
        </div>
        {exercise.clientNotes ?
          <div className="mt-0 text-muted font-italic" style={{fontSize: 10}}>{exercise.clientNotes}</div> : null}
      </div>
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'flex-start'
  },
  image: {
    width: 96,
    height: 54,
    display: 'block'
  },
  number: {
    marginTop: -40,
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: '#000000',
    padding: 5,
    borderRadius: 30,
    width: 30,
    marginBottom: 8
  } as CSSProperties
};
