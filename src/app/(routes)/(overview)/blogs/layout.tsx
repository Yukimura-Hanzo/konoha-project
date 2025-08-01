export default function NextMDXBlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="container mx-auto">
      {children}
    </main>
  );
}
