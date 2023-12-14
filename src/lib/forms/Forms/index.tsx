import React from 'react';
import dynamic from 'next/dynamic';
import { IFormProps } from '../DetailForm/IFormProps';
import { ListFormService } from '../../services/ListFormService';
import Router from 'next/router';
import Spinner from '../../components/Spinner';

const DynamicComponent = dynamic(() => import('../DetailForm/DetailForm'), {
  ssr: false,
  loading: () => <Spinner />,
});

export const Forms: React.FC<IFormProps> = ({ ...props }) => {
  const { IsDlg } = Router.query;
  if (!Router.isReady) {
    return <></>;
  }
  return (
    <DynamicComponent
      {...props}
      IsDlg={props.IsDlg === '1' || IsDlg === '1'}
      lfs={ListFormService}
    />
  );
};

export default Forms;
