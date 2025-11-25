/*********************************

 File:       themecolors.js
 Function:   JS Access to the Theme Colors
 Copyright:  AppDelegates LLC
 Date:       2/26/2019
 Author:     mkahn

 Unfortunately there is no easy linkage from SCSS to JS.

 **********************************/

export const THEME_COLORS = {
    blue: '#269ccc',
    beige: '#F6F7EB',
    red: '#cc2649',
    darkGrey: '#222222',
    green: '#26cc56',
    pink: '#f185d7',
    neonGreen: '#9ccc26',
    neonPink: '#f92672',
    orange: '#fd971f',
    purple: '#6B5180',
    teal: '#81D2C7',
    steelBlue: '#B5BAD0',
    steelPurple: '#7389AE',
    grey50: '#7b7b7b',
    grey75: '#c3c3c3',
    grey90: '#f1f0ee',
    //seaGreen: '#44BBA4',
    seaGreen: '#26cc56'
}

export const CHART_COLORS = {
    deepBlue: '#07009e',
    blue: '#286BB5',
    teal: '#44BBA4',
    purRed: '#ff0000',
    red: '#E94F37',
    fadeRed: "#ffb0a0",
    green: '#007b29',
    seaGreen: '#12bb3c',
    neonGreen: '#A6E22E',
    neonPink: '#f92672',
    orange: '#fd971f',
    yellow: '#ffe000',
    purple: '#ac81fe',
    darkPurple: '#66509f',
}

export const PURPLES = {
    deep: '#32213A',
    faint: '#A799B7',
    mid: '#9888A5',
    rose: '#ce6a85',
    lavender: '#776472'
}

export const CHART_COLORS_ARRAY = (() => {
    const keys = Object.keys(CHART_COLORS);
    return keys.map( key => ({ name: key, color: CHART_COLORS[key]}));
})();

