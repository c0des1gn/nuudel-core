import React, { useEffect } from 'react';
import { Select as BaseSelect, SelectProps, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface ISelectProps extends SelectProps<any> {
  options: ISelectItem[];
  onChange(e: any);
}

interface ISelectItem {
  value: string | any;
  label: string;
  icon?: any;
  disabled?: boolean;
}

export const Select: React.FC<ISelectProps> = React.forwardRef<
  HTMLSelectElement,
  ISelectProps
>(({ options, onChange, ...props }: ISelectProps, ref) => {
  const handleChange = (event: SelectChangeEvent) => {
    let value: any = event?.target?.value;
    if (onChange) {
      onChange(
        !!value && value instanceof Array && value.length > 0 ? value[0] : value
      );
    }
  };

  const handleChangeMultiple = (event: SelectChangeEvent) => {
    let value: any = event?.target?.value;
    const { options = typeof value === 'string' ? value.split(',') : value } =
      event.target as HTMLSelectElement;
    const values: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    if (onChange) {
      onChange(values);
    }
  };

  /*
  useEffect(() => {
    if (onChange) {
      onChange(props.value);
    }
  }, [props.value]); // */

  return (
    <BaseSelect
      ref={ref}
      {...props}
      onChange={props.multiple ? handleChangeMultiple : handleChange}
    >
      {options.map((option: ISelectItem, i: number) => (
        <MenuItem
          key={i}
          value={option?.value}
          disabled={option.disabled === true}
        >
          {!!option?.icon && option.icon}
          {option?.label}
        </MenuItem>
      ))}
    </BaseSelect>
  );
});

export default Select;
