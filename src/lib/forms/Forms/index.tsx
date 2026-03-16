import React from 'react';
import dynamic from 'next/dynamic';
import { IFormProps } from '../DetailForm/IFormProps';
import { ListFormService } from '../../services/ListFormService';
import Spinner from '../../components/Spinner';
//import Router from 'next/router';

const DynamicComponent = dynamic(() => import('../DetailForm/DetailForm'), {
  ssr: false,
  loading: () => <Spinner />,
});

export const Forms: React.FC<IFormProps> = ({ ...props }) => {
  const { IsDlg } = props; // || Router?.query;
  //if (!Router.isReady) { return <></>; }
  return (
    <DynamicComponent
      {...props}
      IsDlg={IsDlg === '1' || IsDlg === true}
      lfs={ListFormService}
    />
  );
};

export default Forms;
