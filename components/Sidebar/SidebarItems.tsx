'use client';
// src/components/Sidebar/SidebarItems.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ItemsList, ItemContainer, ItemWrapper, ItemName } from './SidebarStyles';
import { dummyData } from '..';

interface SidebarItemsProps {
  $displaySidebar: boolean;
}

const SidebarItems = ({ $displaySidebar }: SidebarItemsProps) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(0);
  return (
    <ItemsList>
      {dummyData.map((itemData, index) => (
        <>
          {index === 1 ? (
            <>
              <hr className="sidebar-separator" />
              <p className={'pt-2 text-center text-xs font-light !text-gray-400 ' + (!$displaySidebar ? 'text-[10px]' : '')}>
                <span className={!$displaySidebar ? '!hidden' : ''}>Mes Projets</span>
              </p>
            </>
          ) : null}

          {index === 3 ? (
            <>
              <hr className="sidebar-separator" />
              <p className={'pt-2 text-center text-xs font-light !text-gray-400 ' + (!$displaySidebar ? 'text-[10px]' : '')}>
                <span className={!$displaySidebar ? '!hidden' : ''}>Mes Petits Projets</span>
              </p>
            </>
          ) : null}
          {index === dummyData.length - 1 ? <hr className="sidebar-separator" /> : null}
          <ItemContainer
            key={index}
            onClick={() => {
              setActiveItem(itemData.id);
              router.push(itemData.path);
            }}
            /* Adding active class when the user clicks */
            className={'text-[16px] text-zinc-400 ' + (activeItem === itemData.id ? 'active' : '')}>
            <ItemWrapper style={{ padding: '0.5rem 0.35rem' }}>
              <div className="text-gray-300">{itemData.icon}</div>
              <ItemName $displaySidebar={$displaySidebar}>{itemData.name}</ItemName>
            </ItemWrapper>
          </ItemContainer>
        </>
      ))}
    </ItemsList>
  );
};
export default SidebarItems;
