export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="py-4 bg-gray-100 rounded">
        {children}
      </div>
    </main>
  );
}
