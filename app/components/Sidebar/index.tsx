'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import {
  Children,
  SidebarContainer,
  SidebarWrapper,
  SidebarLogoWrapper,
  SidebarLogo,
  SidebarBrand,
  SidebarToggler,
} from './SidebarStyles';
import { SidebarItems } from '..';

type DisplayProp = { $displaySidebar: boolean };

const SCSidebarContainer = SidebarContainer as unknown as React.ComponentType<
  DisplayProp & React.HTMLAttributes<HTMLDivElement>
>;
const SCSidebarLogoWrapper = SidebarLogoWrapper as unknown as React.ComponentType<
  DisplayProp & React.HTMLAttributes<HTMLDivElement>
>;
const SCSidebarBrand = SidebarBrand as unknown as React.ComponentType<
  DisplayProp & React.HTMLAttributes<HTMLElement>
>;
const SCSidebarToggler = SidebarToggler as unknown as React.ComponentType<
  DisplayProp & React.ButtonHTMLAttributes<HTMLButtonElement>
>;
const SCChildren = Children as unknown as React.ComponentType<
  DisplayProp & React.HTMLAttributes<HTMLDivElement>
>;
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
        className="flex min-h-screen w-[10rem] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-xl"
        $displaySidebar={displaySidebar}
      >
        <SidebarWrapper>
          <SCSidebarLogoWrapper $displaySidebar={displaySidebar}>
            {/* Logo wrapper starts */}
            <SidebarLogo href="#">
              <span className="app-brand-logo demo">
                {/* <img src={BrandLogo} alt="Brand logo" /> */}
              </span>
              <SCSidebarBrand $displaySidebar={displaySidebar} className="app__brand__text">
                {displaySidebar ? 'Outils' : 'Ou til ?'}
              </SCSidebarBrand>
            </SidebarLogo>
            {/* Logo wrapper ends */}

            {/* Toggle button */}
            <SCSidebarToggler $displaySidebar={displaySidebar} onClick={handleSidebarDisplay}>
              <div className="outer__circle">
                <div className="inner__circle" />
              </div>
            </SCSidebarToggler>
          </SCSidebarLogoWrapper>

          {/* Render the SidebarItems component */}
          <SCSidebarItems $displaySidebar={displaySidebar} />
        </SidebarWrapper>
      </SCSidebarContainer>

      {/* Render the children */}
      <SCChildren $displaySidebar={displaySidebar}>{children}</SCChildren>
    </React.Fragment>
  );
}
