"use client";
import React, { useState, useEffect } from "react";
import {
  Children,
  SidebarContainer,
  SidebarWrapper,
  SidebarLogoWrapper,
  SidebarLogo,
  SidebarBrand,
  SidebarToggler,
} from "./SidebarStyles";
import { SidebarItems } from "..";

export default function Sidebar({ children }) {
  const [displaySidebar, setDisplaySidebar] = useState(true); // default for SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // On client only
    const checkMobile = () => {
      const mobile = window.innerWidth < 468;
      setIsMobile(mobile);
      setDisplaySidebar(!mobile);
    };

    checkMobile();

    // Listen to window resize
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleSidebarDisplay = (e) => {
    e.preventDefault();
    if (!isMobile) {
      setDisplaySidebar(!displaySidebar);
    } else {
      setDisplaySidebar(false);
    }
  };

  return (
    <React.Fragment>
      <SidebarContainer className="shadow-xl
  bg-gradient-to-b
  from-gray-900
  via-gray-800
  to-gray-900 flex min-h-screen w-[10rem]" $displaySidebar={displaySidebar}>
        <SidebarWrapper>
          <SidebarLogoWrapper $displaySidebar={displaySidebar}>
            {/* Logo wrapper starts */}
            <SidebarLogo href="#">
              <span className="app-brand-logo demo">
                {/* <img src={BrandLogo} alt="Brand logo" /> */}
              </span>
              <SidebarBrand $displaySidebar={displaySidebar} className="app__brand__text">
                {displaySidebar ? 'Outils' : 'Ou til ?'}
              </SidebarBrand>
            </SidebarLogo>
            {/* Logo wrapper ends */}

            {/* Toggle button */}
            <SidebarToggler $displaySidebar={displaySidebar} onClick={handleSidebarDisplay}>
              <div className="outer__circle">
                <div className="inner__circle" />
              </div>
            </SidebarToggler>
          </SidebarLogoWrapper>

          {/* Render the SidebarItems component */}
          <SidebarItems $displaySidebar={displaySidebar} />
        </SidebarWrapper>
      </SidebarContainer>

      {/* Render the children */}
      <Children $displaySidebar={displaySidebar}>{children}</Children>
    </React.Fragment>
  );
}
