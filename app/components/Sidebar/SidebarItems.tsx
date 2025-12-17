"use client"
// src/components/Sidebar/SidebarItems.jsx
import React, { useState } from "react";
import Link from "next/link";

import {
 ItemsList,
 ItemContainer,
 ItemWrapper,
 ItemName,
} from "./SidebarStyles";
import { dummyData } from "..";
const SidebarItems = ({ displaySidebar }) => {
 const [activeItem, setActiveItem] = useState(0);
return (
 <ItemsList>
 {dummyData.map((itemData, index) => (
 <ItemContainer
 key={index}
 onClick={() => setActiveItem(itemData.id)}
 /* Adding active class when the user clicks */
 className={itemData.id === activeItem ? "active" : ""}
 >
 <Link href={itemData.path}>
 <ItemWrapper>
 {itemData.icon}
 <ItemName $displaySidebar={displaySidebar}>
 {itemData.name}
 </ItemName>
 </ItemWrapper>
 </Link>
 </ItemContainer>
 ))}
 </ItemsList>
 );
};
export default SidebarItems;
