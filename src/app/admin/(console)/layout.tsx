export default function AdminConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-w-0 overflow-x-hidden p-3">
      {children}
    </main>
  );
}