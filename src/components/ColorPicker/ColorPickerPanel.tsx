import { useControllableValue } from 'ahooks';
import cs from 'classnames';
import { CSSProperties } from 'react';
import { Color } from './color';
import './index.scss';
import { ColorType } from './interface';
import Palette from './Palette';

export interface ColorPickerProps {
  className?: string;
  style?: CSSProperties;
  value?: ColorType;
  defaultValue?: ColorType;
  onChange?: (color: Color) => void;
}

function ColorPickerPanel(props: ColorPickerProps) {
  const { className, style, onChange } = props;

  const [colorValue, setColorValue] = useControllableValue<Color>(props);

  const classNames = cs('color-picker', className);

  function onPaletteColorChange(color: Color) {
    setColorValue(color);
    onChange?.(color);
  }

  return (
    <div className={classNames} style={style}>
      <Palette color={colorValue} onChange={onPaletteColorChange}></Palette>
      <div
        style={{ width: 20, height: 20, background: colorValue?.toRgbString() }}
      ></div>
    </div>
  );
}

export default ColorPickerPanel;
