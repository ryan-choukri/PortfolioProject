"use client"
// src/components/Data.js
import {
 HomeIcon,
 LayoutIcon,
 CalendarIcon,
 UserIcon,
 MusicIcon,
 RolesIcon,
 PagesIcon,
 AuthIcon,
 WizardIcon,
 ModalIcon,
} from "./Icons";
export const SIDEBAR_DATA = [
 {
   id: 1,
   name: "Home",
   path: "/",
   icon: <HomeIcon />,
   },
   {
   id: 2,
   name: "keyboard",
   path: "keyboard",
   icon: <LayoutIcon />,
   },
   {
   id: 3,
   name: "2048",
   path: "2048",
   icon: <CalendarIcon />,
   },
   {
   id: 4,
   name: "BPM counter",
   path: "bpmcounter",
   icon: <MusicIcon />,
   },
   {
   id: 5,
   name: "Wheather App",
   path: "wheather",
   icon: <UserIcon />,
   },
//    {
//    id: 6,
//    name: "roles & permissions",
//    path: "roles",
//    icon: <RolesIcon />,
//    },
//    {
//    id: 7,
//    name: "pages",
//    path: "pages",
//    icon: <PagesIcon />,
//    },
//    {
//    id: 8,
//    name: "authentication",
//    path: "authentication",
//    icon: <AuthIcon />,
//    },
//    {
//    id: 9,
//    name: "wizard examples",
//    path: "wizard",
//    icon: <WizardIcon />,
//    },
//    {
//    id: 10,
//    name: "modal examples",
//    path: "modal",
//    icon: <ModalIcon />,
//    },
];