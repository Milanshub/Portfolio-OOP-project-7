import { FC } from 'react'
import { OptimizedImage } from '@/components/ui/optimized-image'

const Hero: FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <OptimizedImage
          src="/images/hero-bg.webp"
          alt="Hero background"
          width={1920}
          height={1080}
          priority
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Full Stack Developer
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Building modern web applications with cutting-edge technologies
        </p>
        <a
          href="#projects"
          className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-colors"
        >
          View My Work
        </a>
      </div>
    </section>
  )
}

export default Hero
