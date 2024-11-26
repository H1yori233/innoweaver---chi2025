import tinycolor from 'tinycolor2';

function colorLerp(color1, color2, weight) {
    return color1 * weight + color2 * (1 - weight);
};

export function GetColor(index: number, scale: number): string {
    const colorPalette: string[] = [
        '#CFBD95',
        '#5D7A7F',
        '#756A8E',
        '#F4E8CB',
        '#7E9397',
        '#968EA8',
        '#AF9968',
        '#41656B',
        '#594D78',
    ];

    const themeColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-primary')
    .trim();
    const cardColor = tinycolor.mix(colorPalette[index % colorPalette.length], themeColor, scale).toHexString();
    return cardColor;
};