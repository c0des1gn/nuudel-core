import React, { useState } from 'react';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  ListItemText,
  Select,
  Checkbox,
  FormControl,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import styles from '../../theme/styles/styles.module.scss';
import { t } from '../../loc/i18n';

type ValueField = 'id' | 'name';

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
  keyfield?: ValueField;
  margin?: 'none' | 'dense';
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

export const MultiSelectField: React.FC<IMultiSelectProps> = React.forwardRef<
  HTMLSelectElement,
  IMultiSelectProps
>(({ ...props }, ref) => {
  const [selectedItems, setSelectedItems] = useState<any[]>(
    props.selectedItems || []
  );

  const onSelectedItemsChange = (event: SelectChangeEvent) => {
    const { options } = event.target as HTMLSelectElement;
    const {
      target: { value },
    } = event;
    let values: string[] = [];
    if (!options) {
      values = typeof value === 'string' ? value.split(',') : (value as any);
    } else {
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
    }

    setSelectedItems(values);
    if (props.valueChanged) {
      props.valueChanged(values);
    }
  };

  return (
    <div className={styles.multiSelectContainer}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id={String(props.id) + '-label'}>{props.label}</InputLabel>
        <Select
          ref={ref}
          labelId={String(props.id) + '-label'}
          id={String(props.id)}
          placeholder={t('PickItems')}
          className={styles.multichoice}
          disabled={props.disabled === true}
          required={props.required === true}
          multiple
          margin={props.margin}
          value={selectedItems}
          onChange={onSelectedItemsChange}
          input={
            <OutlinedInput
              label={props.label}
              id={'select-multiple-' + props.id}
            />
          }
          startAdornment={props.startAdornment}
          renderValue={(selected: string | string[]) =>
            !selected || typeof selected === 'string'
              ? selected
              : props.keyfield === 'id'
              ? selected
                  .map((v) => {
                    let index = props.items.findIndex((it) => it.id === v);
                    let s = index >= 0 ? props.items[index].name : v;
                    return t(s, { defaultValue: s });
                  })
                  .join(', ')
              : selected.map((s) => t(s, { defaultValue: s })).join(', ')
          }
          MenuProps={MenuProps}
        >
          {props.items.map((value) => (
            <MenuItem key={value.id} value={value[props.keyfield || 'name']}>
              <Checkbox
                //disabled={false}
                color="primary"
                checked={
                  selectedItems.findIndex(
                    (s) => s === value[props.keyfield || 'name']
                  ) >= 0
                }
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
});

export default MultiSelectField;
