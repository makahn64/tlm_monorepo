import React, {FC} from 'react';

const BUCKET_HOST = 'https://storage.googleapis.com';

interface OwnProps extends React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement> {
  meta: any;
  bucket?: string;
  label?: string;
}

type Props = OwnProps;

export const GoogleCloudVideo: FC<Props> = ({meta, bucket = 'thelotusmethod-phase2', label, ...rest}) => {

  const fileName = meta && meta.name;
  const urlPath = `${BUCKET_HOST}/${bucket}/${fileName}`;
  console.log(`Media: ${urlPath}`);

  return (
    <div>
      {label && <h4>{label}</h4>}
      {!fileName && <p className="text-mute">No video</p>}
      {fileName ? <div style={styles.container}>
        <video {...rest} style={styles.video} playsInline src={urlPath} controls muted/>
      </div> : null}
    </div>
  )
};

const styles = {
  container: {
    position: 'relative' as 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    minHeight: 200,
  },
  video: {
    position: 'absolute' as 'absolute',
    width: 'auto',
    height: '100%',
    minHeight: 200,
    top: 0,
    left: 0
  }
}
