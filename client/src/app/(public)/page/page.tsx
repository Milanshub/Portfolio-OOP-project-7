import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader } from '@/components/ui/spinner-loader'

// Dynamically import heavy components
const Hero = dynamic(() => import('@/components/sections').then(mod => mod.Hero), {
  loading: () => <Loader />,
})

const Projects = dynamic(() => import('@/components/sections').then(mod => mod.Projects), {
  loading: () => <Loader />,
})

const About = dynamic(() => import('@/components/sections').then(mod => mod.About), {
  loading: () => <Loader />,
})

const Contact = dynamic(() => import('@/components/sections').then(mod => mod.Contact), {
  loading: () => <Loader />,
})

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <Projects />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <Contact />
      </Suspense>
    </main>
  )
} 