import { FC } from 'react'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  github: string
}

const FEATURED_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Project One',
    description: 'A modern web application built with Next.js and TypeScript',
    image: '/images/projects/project1.webp',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    link: 'https://project1.com',
    github: 'https://github.com/username/project1',
  },
  // Add more projects as needed
]

const Projects: FC = () => {
  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Featured Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((project) => (
            <article
              key={project.id}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video relative">
                <OptimizedImage
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={338}
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects 