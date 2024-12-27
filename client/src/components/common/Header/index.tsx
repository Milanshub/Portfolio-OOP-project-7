import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthContext()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Logout', onClick: handleLogout, icon: LogOut },
  ]

  return (
    <header className="bg-background border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Portfolio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="relative ml-3">
                <Button
                  variant="ghost"
                  className="flex items-center"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <User className="h-5 w-5" />
                </Button>

                {isOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    {userNavigation.map((item) => {
                      const Icon = item.icon
                      if (item.href) {
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent"
                          >
                            <Icon className="mr-3 h-4 w-4" />
                            {item.name}
                          </Link>
                        )
                      }
                      return (
                        <button
                          key={item.name}
                          onClick={item.onClick}
                          className="flex w-full items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent"
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  {userNavigation.map((item) => {
                    const Icon = item.icon
                    if (item.href) {
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      )
                    }
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.onClick?.()
                          setIsOpen(false)
                        }}
                        className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </button>
                    )
                  })}
                </>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 