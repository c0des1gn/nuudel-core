import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import { IFormProps } from '../DetailForm/IFormProps';
import { ListFormService } from '../../services/ListFormService';
import { useRouter } from 'next/router';

const DynamicComponent = dynamic(() => import('../DetailForm/DetailForm'), {
  ssr: false,
});

export const Forms: FC<IFormProps> = ({ ...props }) => {
  const router = useRouter();
  const { IsDlg } = router.query;
  return (
    <DynamicComponent
      {...props}
      IsDlg={props.IsDlg === '1' || IsDlg === '1'}
      lfs={ListFormService}
    />
  );
};

export default Forms;
