import React, { FC } from 'react';

interface OwnProps {
  data: (string|number)[];
}

type Props = OwnProps;

export const ULfromArray: FC<Props> = ({ data }) => {
  return (
    <ul>
      { data.map( d => <li key={d}>{d}</li>)}
    </ul>
  );
};
