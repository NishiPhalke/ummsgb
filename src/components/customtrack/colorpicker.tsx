import { ColorPickerProps } from './types';
import React from 'react';
import { ChromePicker } from 'react-color';
import namedColors from 'color-name-list';

export const colorNameFromHex = (hex: string) => {
    let color = namedColors.find((x) => x.hex === hex);
    return (color && color.name) || hex;
};

export const hexFromColorName = (name: string) => {
    if (name[0] === '#') {
        return name;
    }
    if (!name || !name[0]) {
        return '#888888';
    }
    let color = namedColors.find((x) => x.name === name[0].toUpperCase() + name.substring(1));
    return (color && color.hex) || '#888888';
};

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
    return (
        <div>
            <strong>Color:&nbsp;</strong>
            {colorNameFromHex(props.color)}
            <br />
            <ChromePicker
                color={hexFromColorName(props.color)}
                onChangeComplete={(x) => props.onChangeComplete(x.hex)}
            />
        </div>
    );
};

export default ColorPicker;
