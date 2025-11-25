import React, { FC } from 'react';

interface Props {
  heading: string;
  body: string;
  color: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

export const InfoTile: FC<Props> = ({ heading, body, color = 'primary' }) => {

  const className = `bg-${color} rounded-lg p-4`;

  return (
    <div className={className}>
      <p style={style.header}>{heading}</p>
      <p style={style.body}>{body}</p>
    </div>
  );
};

const style = {
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0
  } as React.CSSProperties,
  body: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center'
  } as React.CSSProperties
}
