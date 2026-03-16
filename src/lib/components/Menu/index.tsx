import React from 'react';
import {
  Menu as Navegation,
  MenuProps,
  MenuItem,
  ListItemIcon,
} from '@mui/material';

interface IMenuProps extends MenuProps {
  items: IMenuItem[];
  selected?: string;
}

interface IMenuItem {
  onClick?();
  value?: any;
  label: string;
  icon?: any;
  disabled?: boolean;
  color?: string;
}

export const Menu: React.FC<IMenuProps> = ({
  items,
  selected,
  color,
  ...props
}) => (
  <Navegation {...props}>
    {items.map((option: IMenuItem, index: number) => (
      <MenuItem
        key={index}
        color={color}
        disabled={option.disabled === true}
        onClick={option.onClick}
        value={option.value}
        selected={selected && option.value === selected}
      >
        {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
        {option.label}
      </MenuItem>
    ))}
  </Navegation>
);

export default Menu;
