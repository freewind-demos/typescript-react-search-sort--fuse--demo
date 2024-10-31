import React, { FC } from 'react';
import { Input, Slider } from 'antd';

interface SliderAndInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  inputWidth?: number;
}

export const SliderAndInput: FC<SliderAndInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  inputWidth = 60,
}) => {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <Slider
        style={{ flex: 1, minWidth: 0 }}
        min={min}
        max={max}
        step={step}
        value={value}
        marks={{ [min]: `${min}`, [max]: `${max}` }}
        onChange={onChange}
      />
      <Input
        type="number"
        step={step}
        style={{ width: inputWidth }}
        value={value}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value);
          if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
          }
        }}
      />
    </div>
  );
}; 