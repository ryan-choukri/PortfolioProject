'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import avatar from '@/assets/ryan.jpg';

import { Children, SidebarContainer, SidebarWrapper } from './SidebarStyles';
import { SidebarItems } from '..';

type DisplayProp = { $displaySidebar: boolean };

const SCSidebarContainer = SidebarContainer as unknown as React.ComponentType<DisplayProp & React.HTMLAttributes<HTMLDivElement>>;
const SCChildren = Children as unknown as React.ComponentType<DisplayProp & React.HTMLAttributes<HTMLDivElement>>;
const SCSidebarItems = SidebarItems as unknown as React.ComponentType<SidebarItemsProps>;

interface SidebarItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  $displaySidebar: boolean;
}

interface SidebarProps {
  children: ReactNode; // Define the type for children
}

export default function Sidebar({ children }: SidebarProps) {
  const [displaySidebar, setDisplaySidebar] = useState<boolean>(true); // default for SSR
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // On client only
    const checkMobile = () => {
      const mobile = window.innerWidth < 468;
      setIsMobile(mobile);
      setDisplaySidebar(!mobile);
    };

    checkMobile();

    // Listen to window resize
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSidebarDisplay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isMobile) {
      setDisplaySidebar(!displaySidebar);
    } else {
      setDisplaySidebar(false);
    }
  };

  return (
    <React.Fragment>
      <SCSidebarContainer
        // className="flex min-h-screen w-[10rem] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-xl"
        className="sidebar-shadow flex min-h-screen w-[10rem]"
        $displaySidebar={displaySidebar}>
        <SidebarWrapper>
          <div className={`sidebar-profile ${!displaySidebar ? '!p-0' : ''}`}>
            <div className="avatar-wrapper flex-1">
              <Image src={avatar} alt="Profile" width={56} height={56} className="avatar" />

              {/* <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="avatar" /> */}
              <span className={`status-dot ${!displaySidebar ? '!hidden' : ''}`} />
            </div>

            <div className={`profile-text ${!displaySidebar ? '!hidden' : ''}`}>
              <span className="status-text">Disponible</span>
              <span className="role-text">Ryan</span>
            </div>
          </div>
          {/* Render the SidebarItems component */}
          <SCSidebarItems $displaySidebar={displaySidebar} />
        </SidebarWrapper>
      </SCSidebarContainer>

      {/* Render the children */}
      <SCChildren $displaySidebar={displaySidebar}>{children}</SCChildren>
    </React.Fragment>
  );
}
