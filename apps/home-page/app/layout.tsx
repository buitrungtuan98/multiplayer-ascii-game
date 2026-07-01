import './globals.css'
import { CrtOverlay } from '@ascii-game/ui-ascii';

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
      <body className="font-['Fira_Code']">
        <CrtOverlay />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
