export const metadata = {
  title: 'CHANGE_ME',
  description: 'CHANGE_ME',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
