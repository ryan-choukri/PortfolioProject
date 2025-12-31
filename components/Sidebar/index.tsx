'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
        className="sidebar-shadow flex min-h-screen w-[10rem] lg:w-[12rem]"
        $displaySidebar={displaySidebar}>
        <SidebarWrapper>
          <div className={`sidebar-profile ${!displaySidebar ? '!p-0' : ''}`}>
            <Link href="/contact" className="avatar-wrapper lg:y-2 m-auto flex-5 cursor-pointer transition-opacity hover:opacity-80 lg:mx-5 lg:mr-0">
              <Image src={avatar} alt="Profile" width={56} height={56} className="avatar" />
              <span className={`status-dot ${!displaySidebar ? '!hidden' : ''}`} />
            </Link>

            <div className={`profile-text flex-4 ${!displaySidebar ? '!hidden' : ''}`}>
              <Link href="/contact" className="cursor-pointer transition-opacity hover:opacity-80">
                <span className="status-text">Disponible</span>
              </Link>
              <Link href="/contact" className="cursor-pointer transition-opacity hover:opacity-80">
                <span className="role-text">Ryan</span>
              </Link>
            </div>
          </div>
          {/* Render the SidebarItems component */}
          <SCSidebarItems $displaySidebar={displaySidebar} />
        </SidebarWrapper>
      </SCSidebarContainer>

      {/* Render the children */}
      <SCChildren className={'pl-[10rem] lg:pl-[12rem]'} $displaySidebar={displaySidebar}>
        {children}
      </SCChildren>
    </React.Fragment>
  );
}
