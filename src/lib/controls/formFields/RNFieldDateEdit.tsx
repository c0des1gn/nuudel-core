import React from 'react';
import moment from 'moment';
import { IRNFormFieldProps } from './RNFormField';
import DateFormField, { TextFieldType } from './DateFormField';
import { ControlMode } from 'nuudel-utils';
import { dateToString } from 'nuudel-utils';
import { t } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';

export const getLocale = (attr: string = 'languageTag'): string => {
  return 'en-US';
};

const RNFieldDateEdit: React.FunctionComponent<IRNFormFieldProps> = (props) => {
  const locale = getLocale();
  const { disabled } = storeProps(props);
  let value = props.value ? props.value : null;
  if (props.controlMode === ControlMode.New) {
    value = new Date();
  }
  let type: TextFieldType = 'date';
  return value !== null ? (
    <DateFormField
      id={String(props.id)}
      disabled={props.disabled || disabled}
      defaultValue={dateToString(
        value,
        type === 'date' ? 'YYYY-MM-DD' : undefined,
        undefined
      )}
      type={type}
      placeholder={!value ? t('DateFormFieldPlaceholder') : undefined}
      required={
        props?.required === true || props?.fieldSchema?.Required === true
      }
      area-label={props.fieldSchema.Title}
      //firstDayOfWeek={props.fieldSchema.FirstDayOfWeek}
      onSelectDate={(date: Date | null | undefined) =>
        props.valueChanged(
          dateToString(
            date,
            type === 'date' ? 'YYYY-MM-DD' : undefined,
            undefined
          )
        )
      }
    />
  ) : null;
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldDateEdit);
