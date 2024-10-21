import React from 'react';

export const themes = {
 light: {
   foreground: '#000000',
   background: '#eeeeee',
   notes: '#ffffff',
 },
 dark: {
   foreground: '#ffffff',
   background: '#222222',
   notes: '#708090',
 },
};

export const ThemeContext = React.createContext(themes.light);