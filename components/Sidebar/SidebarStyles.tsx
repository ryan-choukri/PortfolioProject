'use client';
// src/components/Sidebar/SidebarStyles.js
import styled from 'styled-components';
// Children Component
export const Children = styled.div<{ displaySidebar: boolean }>`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  @media (max-width: 468px) {
    padding-left: 3rem;
  }
`;
export const SidebarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
`;
export const SidebarLogoWrapper = styled.div<{ displaySidebar: boolean }>`
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: ${({ displaySidebar }) => (displaySidebar ? 'space-between' : 'center')};
  align-items: center;
  @media (max-width: 468px) {
    justify-content: center;
  }
`;
export const SidebarLogo = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 468px) {
    display: none;
  }
`;

// SidebarBrand
export const SidebarBrand = styled.span<{ $displaySidebar: boolean }>`
  display: ${({ $displaySidebar }) => ($displaySidebar ? 'block' : 'none')};
`;

// SidebarToggler
export const SidebarToggler = styled.button<{ $displaySidebar: boolean }>`
  cursor: pointer;
  display: block;
  @media (max-width: 468px) {
    display: block;
  }
`;

// SidebarItem styles
export const ItemsList = styled.ul`
  list-style: none;
`;
export const ItemContainer = styled.li`
  margin: 0.4rem 0rem;
  width: 100%;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background: rgba(117, 117, 117, 0.06);
  }
  &.active {
    background: rgb(76 88 93 / 16%);
  }
`;
export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #fdfdfd;
`;
export const ItemName = styled.span<{ $displaySidebar: boolean }>`
  margin-left: 0.5rem;
  display: block;
  @media (max-width: 468px) {
    display: none;
  }

  text-transform: capitalize;
`;
// Sidebar Container
export const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: '10rem';
  height: 100vh;
  padding: 0.5rem;
  //  background: rgba(117, 117, 117, 0.06);
  // border-right: 1px solid #d4d8dd;
  overflow-x: hidden;
  overflow-y: hidden;
  box-shadow: 7px 0px 15px 0px rgb(0 0 0 / 15%);
  ${ItemWrapper} {
    justify-content: left;
    @media (max-width: 468px) {
      justify-content: center;
    }
  }
  &:hover {
    box-shadow: 7px 0px 15px 0px rgb(0 0 0 / 22%);
  }
  ::-webkit-scrollbar {
    width: 4px;
    height: 3px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    //  background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(147, 147, 147, 0.06);
    &:hover {
      background: rgba(168, 168, 168, 0.06);
    }
  }
  @media (max-width: 468px) {
    width: 3rem;
  }
`;
