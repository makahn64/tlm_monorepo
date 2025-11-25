import React, {FC} from 'react';

const BUCKET_HOST = 'https://storage.googleapis.com';

interface OwnProps extends React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement> {
  meta: any;
  bucket?: string;
  label?: string;
  width?: number;
}

type Props = OwnProps;

export const GoogleCloudVideo: FC<Props> = ({meta, bucket = 'thelotusmethod-phase2', label, width = 500 , ...rest}) => {

  const fileName = meta && meta.name;
  const urlPath = `${BUCKET_HOST}/${bucket}/${fileName}`;
  console.log(`Media: ${urlPath}`);

  const styles = {
    container: {
      width,
    },
    video: {
      width,
    }
  }

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


