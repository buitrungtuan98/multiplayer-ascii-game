import './globals.css'

export const metadata = {
  title: 'ASCII Game Universe',
  description: 'Zero-Cost, Zero-Database, Full ASCII multiplayer gaming.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
