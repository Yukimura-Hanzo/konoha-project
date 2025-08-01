//? UI
import NavigationBar from "@/app/(ui)/navigation-bar";
import Footer from "@/app/(ui)/footer";
import { Provider } from "@/app/(ui)/auth/providers";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      {/* Navigation bar */}
      <Provider><NavigationBar /></Provider>
      <div style={{ viewTransitionName: "page" }}>
        {children}
      </div>
      {/* Footer */}
      <Footer />
    </main>
  );
}