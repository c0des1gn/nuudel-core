import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface INumberFormatProps extends NumericFormatProps {
  //ref: any;
  name: string;
  onChange(e: any);
}

const NumberFormatInput = React.forwardRef<
  HTMLInputElement,
  INumberFormatProps
>(function NumberFormatInput({ name, onChange, ...props }, ref) {
  return (
    <NumericFormat
      thousandSeparator
      valueIsNumericString
      allowLeadingZeros
      {...props}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: name,
            value: values.value,
          },
        });
      }}
    />
  );
});
/*
export const NumberFormatInput: React.FC<INumberFormatProps> = ({
  ref,
  onChange,
  ...props
}) => (
  <NumericFormat
    {...props}
    getInputRef={ref}
    onValueChange={(values) => {
      onChange({
        target: {
          name: props.name,
          value: values.value,
        },
      });
    }}
    thousandSeparator
    valueIsNumericString //isNumericString
    allowLeadingZeros
  />
); // */

export default NumberFormatInput;
