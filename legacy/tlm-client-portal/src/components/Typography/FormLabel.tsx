import React, { FC } from 'react';

interface Props {}

export const FormLabel: FC<Props> = ({ children }) => {
  return (
    <p className="flabel">{children}</p>
  );
};
