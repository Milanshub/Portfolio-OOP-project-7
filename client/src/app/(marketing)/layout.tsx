import Link from 'next/link'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="hover:text-foreground/80">
              Home
            </Link>
            <Link href="/about" className="hover:text-foreground/80">
              About
            </Link>
            <Link href="/projects" className="hover:text-foreground/80">
              Projects
            </Link>
            <Link href="/contact" className="hover:text-foreground/80">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="container flex h-14 items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 