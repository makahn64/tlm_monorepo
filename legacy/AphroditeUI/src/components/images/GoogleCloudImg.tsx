import React, {FC} from 'react';

const BUCKET_HOST = 'https://storage.googleapis.com';

interface OwnProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement> {
  meta: any;
  bucket?: string;
  label?: string;
  noGap?: boolean;
}

type Props = OwnProps;

export const GoogleCloudImg: FC<Props> = ({meta, bucket = 'thelotusmethod-phase2', label, noGap, ...rest}) => {

  const fileName = meta && meta.name;
  const topGap = noGap ? 'mt-0' : 'mt-5';

  return (
    <div className={topGap}>
      { label && <h4>{label}</h4>}
      { !fileName && <p className="text-mute">No image</p> }
      { fileName &&   <img src={`${BUCKET_HOST}/${bucket}/${fileName}`} {...rest} alt={fileName}/> }
    </div>
)
  ;
};
