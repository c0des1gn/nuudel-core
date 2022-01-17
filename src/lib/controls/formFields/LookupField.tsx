import React from 'react';
//import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputLabel, MenuItem, Select, FormControl } from '@material-ui/core';
import MultiSelectField from './MultiSelectField';
import { ControlMode } from '../../common/ControlMode';
import styles from './styles.module.scss';
import { t } from '@Translate';
import { IRNFormFieldProps } from './RNFormField';
import { ListFormService } from '../../services/ListFormService';

export interface ILookupFieldProps extends IRNFormFieldProps {
  disabled?: boolean;
  required?: boolean;
}

export interface ILookupFieldState {
  options: any[];
}

export default class LookupField extends React.Component<
  ILookupFieldProps,
  ILookupFieldState
> {
  public constructor(props: ILookupFieldProps) {
    super(props);
    this.state = {
      options: [],
    };
    if (props.fieldSchema.JsonOption && props.fieldSchema.JsonOption.list) {
      let filter: string = !props.fieldSchema.JsonOption?.filter
        ? '{}'
        : `{"${props.fieldSchema.JsonOption?.filter.replace(/\=/g, '":"')}"}`;
      ListFormService.getDataAll(
        props.fieldSchema.JsonOption?.list,
        props.fieldSchema.JsonOption?.column,
        props.client,
        {
          filter: filter,
          sort: props.fieldSchema.JsonOption?.sort || '{}',
        },
      ).then(r => {
        if (r && r instanceof Array) {
          let choices: any[] = r.map(option => ({
            id: option._id,
            name: option[this.props.fieldSchema.JsonOption.column],
          }));

          if (this.props.fieldSchema.FieldType !== 'LookupMulti') {
            if (!(this.props.required || this.props.fieldSchema.Required)) {
              choices = [{ id: 0, name: t('LookupEmptyOptionText') }].concat(
                choices,
              );
            }
          }
          this.setState({ options: choices });
        }
      });
    }
  }

  public render() {
    if (this.props.fieldSchema.FieldType !== 'LookupMulti') {
      const value = this.props.value ? this.props.value : '';
      return (
        <div className={styles.pickerview}>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor={String(this.props.id) + '-label'}>
              {this.props.label}
            </InputLabel>
            <Select
              disabled={this.props.disabled}
              id={String(this.props.id)}
              className={styles.lookup}
              required={
                this.props?.required === true ||
                this.props?.fieldSchema?.Required === true
              }
              placeholder={t('SelectOne')}
              value={
                this.props.controlMode === ControlMode.New &&
                this.props.fieldSchema.DefaultValue
                  ? this.props.fieldSchema.DefaultValue
                  : value
              }
              renderValue={(selected: string) => {
                let [id, val] =
                  !!selected && selected.indexOf('::') >= 0
                    ? selected.split('::', 2)
                    : [selected, selected];
                let index: number = this.state.options
                  ? this.state.options.findIndex(s => s.id === id)
                  : -1;
                return index >= 0 ? this.state.options[index].name : val || '';
              }}
              inputProps={{
                id: String(this.props.id) + '-label',
              }}
              onChange={(e: any) => this.props.valueChanged(e.target.value)}
              label={this.props.label}
            >
              {this.state.options.map(value => (
                <MenuItem key={value.id} value={value.id + '::' + value.name}>
                  {value.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      );
    } else {
      let values: any[] = [];
      if (this.props.value) {
        if (
          typeof this.props.value === 'string' ||
          this.props.value instanceof String
        ) {
          values = this.props.value.split(',').filter(s => s);
        } else if (this.props.value instanceof Array) {
          values = this.props.value;
        }
      }
      return (
        <MultiSelectField
          id={String(this.props.id)}
          disabled={this.props.disabled}
          items={this.state.options}
          required={
            this.props?.required === true ||
            this.props?.fieldSchema?.Required === true
          }
          label={this.props.label}
          selectedItems={
            this.props.controlMode === ControlMode.New &&
            this.props.fieldSchema.DefaultValue &&
            typeof this.props.value === 'undefined'
              ? typeof this.props.fieldSchema.DefaultValue === 'string'
                ? this.props.fieldSchema.DefaultValue.split(',')
                : this.props.fieldSchema.DefaultValue
              : values
          }
          valueChanged={(values: string[]) => this.props.valueChanged(values)}
        />
      );
    }
  }
}
