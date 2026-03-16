import React, { CSSProperties, ReactElement } from 'react';

interface IProps {
  title?: string;
  className?: string;
  style?: CSSProperties;
  //icon?: ReactElement;
}

export const NoResult: React.FC<IProps> = ({
  title = 'NoResult',
  className,
  style,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 16,
        color: '#999',
        opacity: 0.75,
        width: '100%',
        ...style,
      }}
      className={className}
    >
      {title}
    </div>
  );
};

export default NoResult;
