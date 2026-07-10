import { GradientBackground } from "@/components/gradient-background";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <GradientBackground />
      <main id="main-content" className="flex flex-1 flex-col" role="main">
        {children}
      </main>
    </div>
  );
}
