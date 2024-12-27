import { FC } from 'react'
import { OptimizedImage } from '@/components/ui/optimized-image'

const SKILLS = [
  'React/Next.js',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Tailwind CSS',
  'AWS',
  'Docker',
  'Git',
]

const About: FC = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <OptimizedImage
              src="/images/profile.webp"
              alt="Profile photo"
              width={600}
              height={600}
              className="object-cover"
            />
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
            <p className="text-muted-foreground mb-6">
              I'm a Full Stack Developer with a passion for building modern web applications.
              With expertise in both frontend and backend technologies, I create scalable
              and performant solutions that solve real-world problems.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 