import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Building,
  FileText,
  Heart,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";

import Link from "next/link";


type AppSidebarProps = { userType: "manager" | "tenant" };

const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const navLinks =
    userType === "manager"
      ? [
          { icon: Building, label: "Properties", href: "/managers/properties" },
          // { icon: FileText, label: "Applications", href: "/managers/applications" },
          { icon: Settings, label: "Settings", href: "/managers/settings" },
        ]
      : [
        { icon: Home, label: "Residences", href: "/tenants/residences" },
          { icon: Heart, label: "Favorites", href: "/tenants/favorites" },
          { icon: FileText, label: "Booked", href: "/tenants/booked" },
          
          { icon: Settings, label: "Settings", href: "/tenants/settings" },
        ];

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="fixed left-0 bg-white shadow-lg"
      style={{ top: `${NAVBAR_HEIGHT}px`, height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex min-h-[56px] w-full items-center pt-3 mb-3",
                open ? "justify-between px-6" : "justify-center"
              )}
            >
              {open ? (
                <>
                  <h1 className="text-xl font-bold text-gray-800">
                    {userType === "manager" ? "Manager View" : "Renter View"}
                  </h1>
                  <button
                    className="hover:bg-gray-100 p-2 rounded-md"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                    title="Close sidebar"
                    aria-controls="app-sidebar"
                    aria-expanded={open}
                  >
                    <X className="h-6 w-6 text-gray-600" aria-hidden="true" />
                  </button>
                </>
              ) : (
                <button
                  className="hover:bg-gray-100 p-2 rounded-md"
                  onClick={toggleSidebar}
                  aria-label="Open sidebar"
                  title="Open sidebar"
                  aria-controls="app-sidebar"
                  aria-expanded={open}
                >
                  <Menu className="h-6 w-6 text-gray-600" aria-hidden="true" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent id="app-sidebar">
        <SidebarMenu>
          {navLinks.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center px-7 py-7",
                    isActive ? "bg-gray-100" : "text-gray-600 hover:bg-gray-100",
                    open ? "text-blue-600" : "ml-[5px]"
                  )}
                >
                  <Link href={href} className="w-full" scroll={false}>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-600"}`}
                        aria-hidden="true"
                      />
                      {open && (
                        <span className={`font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`}>
                          {label}
                        </span>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;