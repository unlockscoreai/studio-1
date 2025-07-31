export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
                {/* Logo component removed */}
            </div>
            {children}
        </div>
    </main>
  );
}
