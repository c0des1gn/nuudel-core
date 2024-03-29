import React from 'react';
import {
  Autocomplete,
  Chip,
  TextField,
  //TextFieldProps,
  //AutocompleteProps,
} from '@mui/material';

type ITagsProps = {
  required: boolean;
  label: string;
  margin: 'none' | 'dense' | 'normal';
  disabled: boolean;
  placeholder: string;
  variant: 'outlined' | 'standard' | 'filled';
  onChange?(event: any, value: any[], reason?: any): void;
};

export const TagsInput: React.FC<ITagsProps & any> = React.forwardRef<
  HTMLSelectElement | HTMLDivElement,
  ITagsProps
>(
  (
    {
      required,
      label,
      variant,
      margin,
      disabled = false,
      placeholder,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <Autocomplete
        options={[]}
        fullWidth
        {...props}
        ref={ref}
        multiple
        freeSolo
        onChange={onChange}
        readOnly={disabled}
        //disabled={disabled}
        placeholder={placeholder}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant={'outlined'}
              label={option}
              disabled={disabled}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            label={label}
            variant={variant}
            margin={margin}
            disabled={disabled}
            placeholder={placeholder}
          />
        )}
      />
    );
  }
);

export default TagsInput;
