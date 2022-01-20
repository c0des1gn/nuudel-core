import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { ControlMode } from 'nuudel-utils';
import { InputLabel, MenuItem, Select, FormControl } from '@material-ui/core';
import { TagsInput } from '@Components';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';
import MultiSelectField from './MultiSelectField';
import styles from './styles.module.scss';
import { t } from 'nuudel-utils';

const RNFieldChoiceEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  const { disabled } = storeProps(props);
  const label = props.label || props.fieldSchema.Title;
  if (props.fieldSchema.FieldType !== 'MultiChoice') {
    const options = !(props.fieldSchema.Required || props.required)
      ? props.fieldSchema.Choices
      : [{ id: '', name: 'None' }].concat(props.fieldSchema.Choices);
    return (
      <div className={styles.pickerview}>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel htmlFor={String(props.id) + '-label'}>{label}</InputLabel>
          <Select
            disabled={props.disabled || disabled}
            id={String(props.id)}
            required={
              props?.required === true || props?.fieldSchema?.Required === true
            }
            className={styles.choice}
            placeholder={t('SelectOne')}
            value={
              props.controlMode === ControlMode.New &&
              props.fieldSchema.DefaultValue &&
              !props.value
                ? props.fieldSchema.DefaultValue
                : props.value
            }
            renderValue={(selected) =>
              !selected ? '' : t(selected, { defaultValue: selected })
            }
            inputProps={{
              id: String(props.id) + '-label',
            }}
            onChange={(e: any) => props.valueChanged(e.target.value)}
            label={label}
          >
            {options.map((value) => (
              <MenuItem key={value.id} value={value.id}>
                {t(value.name, { defaultValue: value.name })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  } else {
    const options = props.fieldSchema.Choices; //MultiChoices;
    let values: any[] = [];
    if (options instanceof Array && options.length > 0) {
      if (props.value) {
        if (typeof props.value === 'string') {
          values = props.value.split(',').filter((s) => s);
        } else if (props.value instanceof Array) {
          values = props.value;
        }
      }
      return (
        <MultiSelectField
          disabled={props.disabled || disabled}
          id={String(props.id)}
          //title={JSON.stringify(props.fieldSchema) + props.value}
          items={options}
          label={label}
          required={
            props?.required === true || props?.fieldSchema?.Required === true
          }
          selectedItems={
            props.controlMode === ControlMode.New &&
            props.fieldSchema.DefaultValue &&
            !props.value
              ? typeof props.fieldSchema.DefaultValue === 'string'
                ? props.fieldSchema.DefaultValue.split(',')
                : props.fieldSchema.DefaultValue
              : values
          }
          valueChanged={
            (item: any[]) => props.valueChanged(item) //getUpdatedValue(values, item)
          }
        />
      );
    } else {
      return (
        <TagsInput
          disabled={props.disabled || disabled}
          id={String(props.id)}
          required={
            props?.required === true || props?.fieldSchema?.Required === true
          }
          defaultValue={
            props.controlMode === ControlMode.New &&
            props.fieldSchema.DefaultValue &&
            !props.value
              ? typeof props.fieldSchema.DefaultValue === 'string'
                ? props.fieldSchema.DefaultValue.split(',')
                : props.fieldSchema.DefaultValue
              : values
          }
          label={label}
          placeholder={t('TextFormFieldPlaceholder')}
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={(chips: string[]) => {
            if (chips && chips instanceof Array) {
              props.valueChanged(chips);
            }
          }}
        />
      );
    }
  }
};

function getUpdatedValue(
  oldValues: string[],
  changedItem: any //IDropdownOption,
): string {
  const changedKey = changedItem.key.toString();
  const newValues = [...oldValues];
  if (changedItem.selected) {
    // add option if it's checked
    if (newValues.indexOf(changedKey) < 0) {
      newValues.push(changedKey);
    }
  } else {
    // remove the option if it's unchecked
    const currIndex = newValues.indexOf(changedKey);
    if (currIndex > -1) {
      newValues.splice(currIndex, 1);
    }
  }
  return newValues.join(',');
}

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldChoiceEdit);
