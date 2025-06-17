export const metadata = {
  title: 'Sourdo',
  description: 'Sourdo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
