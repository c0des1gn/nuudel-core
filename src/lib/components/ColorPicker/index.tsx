import React, { useCallback, useRef, useState, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import useClickOutside from './useClickOutside';
import styles from './styles.module.scss';

interface IProps {
  color?: string;
  defaultColor?: string;
  presetColors?: string[];
  onChange?(newColor: string);
  showInput?: boolean;
  label?: string;
}

export const ColorPicker: React.FC<IProps> = ({
  presetColors = [],
  defaultColor = '#ffffff',
  ...props
}) => {
  const popover = useRef();
  const [isOpen, toggle] = useState<boolean>(false);
  const [color, setColor] = useState<string>(props.color || defaultColor);
  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  useEffect(() => {
    if (props.color && color !== props.color) {
      setColor(props.color);
    }
  }, [props.color]);

  const onChange = (_color: string) => {
    let col: string = _color.replace(/^#/, '');
    if (col.length === 3) {
      col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
    }
    if (col.length !== 6) {
      return;
    }
    col = `#${col}`;
    setColor(col);
    if (props.onChange) {
      props.onChange(col);
    }
  };

  return (
    <div className={styles.picker}>
      <div className={styles.row}>
        <div
          className={styles.swatch}
          style={{ backgroundColor: color }}
          onClick={() => toggle(true)}
        />
        <span>{props.label}</span>
      </div>
      {isOpen && (
        <div className={styles.popover} ref={popover}>
          <HexColorPicker color={color} onChange={onChange} />
          <div className={styles.row}>
            {!!props.showInput && (
              <HexColorInput
                color={color}
                prefixed
                onChange={onChange}
                className={styles.input}
              />
            )}
            {!!presetColors && presetColors.length > 0 && (
              <div className={styles.pickerSwatches}>
                {presetColors.map(presetColor => (
                  <button
                    key={presetColor}
                    className={styles.pickerSwatch}
                    style={{ background: presetColor }}
                    onClick={() => onChange(presetColor)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
