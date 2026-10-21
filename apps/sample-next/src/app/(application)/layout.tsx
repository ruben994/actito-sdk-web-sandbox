import { PropsWithChildren } from "react";
import { ActitoProvider } from "@/actito/actito-context";
import { ActitoAutoLauncher } from "@/components/actito/actito-auto-launcher";
import { ActitoEventHandler } from "@/components/actito/actito-event-handler";
import { ActitoEventLogger } from "@/components/actito/actito-event-logger";
import { MobileSidebar } from "@/components/navigation/mobile-sidebar";
import { Sidebar } from "@/components/navigation/sidebar";
import { StickyNavigation } from "@/components/navigation/sticky-navigation";
import { CurrentUserProvider } from "@/context/current-user";
import { NavigationProvider } from "@/context/navigation";

export default function ApplicationLayout({ children }: PropsWithChildren) {
  return (
    <ActitoProvider>
      <ActitoAutoLauncher />
      <ActitoEventLogger />
      <ActitoEventHandler />

      <CurrentUserProvider>
        <NavigationProvider>
          <MobileSidebar />

          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <Sidebar />
          </div>

          <div className="lg:pl-72">
            <StickyNavigation />

            <main className="py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </NavigationProvider>
      </CurrentUserProvider>
    </ActitoProvider>
  );
}
