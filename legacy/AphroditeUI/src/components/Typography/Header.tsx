import React, { FC } from 'react';

interface Props {}

export const Header: FC<Props> = ({ children }) => {
  return (
    <h5 className="header">{children}</h5>
  );
};
