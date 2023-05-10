import React from 'react';
import moment from 'moment';
import { TextField } from '@mui/material';
import styles from './styles.module.scss';

export type TextFieldType = 'time' | 'date' | 'datetime-local';

export interface IDateFormFieldProps {
  //value: Date;
  id: string;
  placeholder?: string;
  required?: boolean;
  'aria-label'?: string;
  onSelectDate?(date: any);
  type: TextFieldType;
  disabled: boolean;
  defaultValue: any;
  label?: string;
}

const DateFormField = (props: IDateFormFieldProps) => {
  let {
    type,
    defaultValue = new Date().toISOString().substring(0, 10),
    label = '',
    id = 'date',
  } = props;
  if (!type) {
    type = 'date';
  }
  return (
    <TextField
      {...props}
      defaultValue={defaultValue}
      label={label}
      id={id}
      type={type}
      onChange={(e) =>
        props.onSelectDate(
          e.target.value && moment(e.target.value).isValid()
            ? moment(e.target.value).toDate()
            : e.target.value
        )
      }
      className={styles.datetime}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

export default DateFormField;
