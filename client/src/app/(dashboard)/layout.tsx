"use client";

import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/tenants")) ||
        (userRole === "tenant" && pathname.startsWith("/managers"))
      ) {
        router.push(
          userRole === "manager"
            ? "/managers/properties"
            : "/tenants/residences",
          { scroll: false }
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <>Loading...</>;
  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />
        {/*
          This div below pushes the main content down to avoid the fixed Navbar.
          You also need to give it left padding to account for the fixed Sidebar.
        */}
        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }} className="pl-[195px]">
          <main className="flex">
            <Sidebar userType={authUser.userRole.toLowerCase()} />
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
// "use client";

// import Navbar from "@/components/Navbar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import Sidebar from "@/components/AppSidebar";
// import { NAVBAR_HEIGHT } from "@/lib/constants";
// import React, { useEffect, useState } from "react";
// import { useGetAuthUserQuery } from "@/state/api";
// import { usePathname, useRouter } from "next/navigation";

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (authUser) {
//       const userRole = authUser.userRole?.toLowerCase();
//       if (
//         (userRole === "manager" && pathname.startsWith("/tenants")) ||
//         (userRole === "tenant" && pathname.startsWith("/managers"))
//       ) {
//         router.push(
//           userRole === "manager"
//             ? "/managers/properties"
//             : "/tenants/residences",
//           { scroll: false }
//         );
//       } else {
//         setIsLoading(false);
//       }
//     }
//   }, [authUser, router, pathname]);

//   if (authLoading || isLoading) return <>Loading...</>;
//   if (!authUser?.userRole) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen w-full bg-primary-100">
//         <Navbar />
//         <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
//           <main className="flex">
//             <Sidebar userType={authUser.userRole.toLowerCase()} />
//             <div className="flex-grow transition-all duration-300">
//               {children}
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default DashboardLayout;
