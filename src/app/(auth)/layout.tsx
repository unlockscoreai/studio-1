import Link from "next/link";
import { Rocket } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-secondary">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80">
          <Rocket className="h-6 w-6" />
          <span className="font-bold font-headline">UnlockScore AI</span>
        </Link>
      </div>
      {children}
    </div>
  )
}
