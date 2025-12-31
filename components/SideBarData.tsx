'use client';
// src/components/Data.js
import { GamesIcon, BadgeIcon, TvOutlinedIcon, KeyboardIcon, MusicIcon, SunnyIcon, Grid4x4Icon, AppsIcon, ContactIcon } from './Icons';

export const SIDEBAR_DATA = [
  {
    id: 1,
    name: 'Mon CV',
    path: '/',
    icon: <BadgeIcon />,
  },
  {
    id: 17,
    name: 'App Watch Finder',
    path: 'watchfinder',
    icon: <TvOutlinedIcon />,
  },
  {
    id: 7,
    name: 'Jeux Mobile',
    path: 'mobilegames',
    icon: <GamesIcon />,
  },
  {
    id: 5,
    name: 'Méteo Monde',
    path: 'meteo',
    icon: <SunnyIcon />,
  },
  {
    id: 6,
    name: 'Simulation',
    path: 'smile',
    icon: <Grid4x4Icon />,
  },
  {
    id: 3,
    name: '2048',
    path: '2048',
    icon: <AppsIcon />,
  },
  {
    id: 2,
    name: 'keyboard',
    path: 'keyboard',
    icon: <KeyboardIcon />,
  },
  {
    id: 4,
    name: 'BPM counter',
    path: 'bpmcounter',
    icon: <MusicIcon />,
  },
  {
    id: 8,
    name: 'Contact',
    path: 'contact',
    icon: <ContactIcon />,
  },
];
