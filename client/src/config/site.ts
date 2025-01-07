export const siteConfig = {
    name: "Milan's Portfolio",
    description: "Full-stack developer portfolio showcasing projects and skills",
    url: "https://milanshub.dev", // Replace with your actual domain
    
    // Meta information
    meta: {
      title: {
        default: "Milan's Portfolio",
        template: "%s | Milan's Portfolio"
      },
      description: "Full-stack developer specializing in React, Node.js, and TypeScript",
      keywords: [
        "Full-stack Developer",
        "React",
        "TypeScript",
        "Node.js",
        "Portfolio",
        "Web Development"
      ],
      authors: [
        {
          name: "Milan Shubaev",
          url: "https://github.com/Milanshub"
        }
      ],
      creator: "Milan Shubaev",
      themeColor: "#ffffff",
      colorScheme: "light dark",
    },
  
    // Navigation links (matching your routes.ts)
    mainNav: [
      {
        title: "Home",
        href: "/"
      },
      {
        title: "Projects",
        href: "/projects"
      },
      {
        title: "Technologies",
        href: "/technologies"
      },
      {
        title: "Contact",
        href: "/contact"
      }
    ],
  
    // Social links
    links: {
      github: "https://github.com/Milanshub",
      linkedin: "https://www.linkedin.com/in/milan-shubaev-88276465/",
      email: "shubaevnila@gmail.com"
    }
  } as const;
  
  export type SiteConfig = typeof siteConfig;