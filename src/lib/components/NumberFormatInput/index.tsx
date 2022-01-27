import NumberFormat from 'react-number-format';

interface INumberFormatProps {
  inputRef: any;
  name: string;
  onChange(e: any);
}

export const NumberFormatInput: React.FC<INumberFormatProps> = ({
  inputRef,
  onChange,
  ...props
}) => (
  <NumberFormat
    {...props}
    getInputRef={inputRef}
    onValueChange={(values) => {
      onChange({
        target: {
          name: props.name,
          value: values.value,
        },
      });
    }}
    thousandSeparator
    isNumericString
    allowEmptyFormatting
    allowLeadingZeros
    //suffix="₮"
  />
);

export default NumberFormatInput;
