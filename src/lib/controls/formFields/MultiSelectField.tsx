import React from 'react';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  ListItemText,
  Select,
  Checkbox,
  FormControl,
} from '@material-ui/core';
import styles from './styles.module.scss';
import { t } from '@Translate';

//extends MultiSelectProps
export interface IMultiSelectProps {
  id: string;
  items: any[];
  selectedItems: any[];
  disabled?: boolean;
  required?: boolean;
  label?: string;
  startAdornment?: any;
  onChangeInput?(val: any);
  valueChanged(val: any);
}

export interface IMultiSelectStates {
  selectedItems: any[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default class MultiSelectField extends React.Component<
  IMultiSelectProps,
  IMultiSelectStates
> {
  constructor(props: IMultiSelectProps) {
    super(props);
    this.state = {
      selectedItems: props.selectedItems || [],
    };
  }

  onSelectedItemsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { options } = event.target as HTMLSelectElement;
    let values: string[] = [];
    if (!options) {
      values = event.target.value as string[];
    } else {
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
    }

    this.setState({ selectedItems: values }, () =>
      this.props.valueChanged(values),
    );
  };

  render() {
    return (
      <div className={styles.multiSelectContainer}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id={String(this.props.id) + '-label'}>
            {this.props.label}
          </InputLabel>
          <Select
            labelId={String(this.props.id) + '-label'}
            id={String(this.props.id)}
            placeholder={t('PickItems')}
            className={styles.multichoice}
            disabled={this.props.disabled === true}
            required={this.props.required === true}
            multiple
            value={this.state.selectedItems}
            onChange={this.onSelectedItemsChange}
            input={
              <OutlinedInput
                label={this.props.label}
                id={'select-multiple-' + this.props.id}
              />
            }
            startAdornment={this.props.startAdornment}
            renderValue={selected =>
              !selected
                ? selected
                : (selected as string[])
                    .map(s => t(s, { defaultValue: s }))
                    .join(', ')
            }
            MenuProps={MenuProps}
          >
            {this.props.items.map(value => (
              <MenuItem key={value.id} value={value.name}>
                <Checkbox
                  //disabled={false}
                  color="primary"
                  checked={this.state.selectedItems.indexOf(value.name) >= 0}
                />
                <ListItemText
                  primary={t(value.name, { defaultValue: value.name })}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}
