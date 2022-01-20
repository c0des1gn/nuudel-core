import React, { useEffect } from 'react';
import { Select as BaseSelect, SelectProps, MenuItem } from '@material-ui/core';

interface ISelectProps extends SelectProps {
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
>(({ options, onChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    if (onChange) {
      onChange(
        value && value instanceof Array && value.length > 0 ? value[0] : value,
      );
    }
  };

  const handleChangeMultiple = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const { options } = event.target as HTMLSelectElement;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    if (onChange) {
      onChange(value);
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
          value={option.value}
          disabled={option.disabled === true}
        >
          {option.icon && option.icon}
          {option.label}
        </MenuItem>
      ))}
    </BaseSelect>
  );
});

export default Select;
