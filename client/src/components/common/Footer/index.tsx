import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    social: [
      {
        name: 'GitHub',
        href: 'https://github.com',
        icon: Github,
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: Linkedin,
      },
      {
        name: 'Email',
        href: 'mailto:your-email@example.com',
        icon: Mail,
      },
    ],
  }

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link
                href={item.href}
                className="text-sm leading-6 text-muted-foreground hover:text-primary"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{item.name}</span>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
          &copy; {new Date().getFullYear()} Your Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  )
} 