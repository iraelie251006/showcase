import type React from "react"
import { Card } from "@/components/ui/card"

interface Technology {
  name: string
  description: string
  icon: React.ReactNode
}

const technologies: Technology[] = [
  {
    name: "React",
    description: "A JavaScript library for building user interfaces",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    description: "The React framework for production",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path d="M11.5 0C5.15 0 0 5.15 0 11.5S5.15 23 11.5 23 23 17.85 23 11.5 17.85 0 11.5 0zm5.5 16.5l-3.5-5v5h-2V7h2l3.5 5V7h2v9.5h-2z" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    description: "JavaScript with syntax for types",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="2"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 8h8M12 8v8M14 14h2a1.5 1.5 0 0 0 0-3h-2v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
        <path
          d="M12 6C9.33 6 7.67 7.33 7 10c1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.12 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.15 14.48 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.38 16.85 9.52 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.62 13.15 9.48 12 7 12z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
        <path
          d="M21.62 11.11l-9.73-9.73a1.25 1.25 0 0 0-1.78 0l-2.02 2.02 2.56 2.56a1.5 1.5 0 0 1 1.9 1.9l2.47 2.47a1.5 1.5 0 1 1-.9.85l-2.3-2.3v6.06a1.5 1.5 0 1 1-1.2-.05V8.8a1.5 1.5 0 0 1-.82-1.96L7.24 4.28l-4.86 4.86a1.25 1.25 0 0 0 0 1.78l9.73 9.73a1.25 1.25 0 0 0 1.78 0l9.73-9.73a1.25 1.25 0 0 0 0-1.78z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Vercel",
    description: "Platform for frontend frameworks and static sites",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path d="M12 2L3 20h20L12 2z" />
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    description: "Advanced open source database",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
        <path
          d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <ellipse cx="12" cy="7" rx="8" ry="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 12c0 2.21 3.58 4 8 4s8-1.79 8-4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

const firstRowTechnologies = technologies.slice(0, 4)
const secondRowTechnologies = technologies.slice(4)

export function TechnologiesSection() {
  return (
    <section className="min-h-screen bg-background py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Modern <span className="text-purple">Technologies</span> In <span className="text-purple">Use</span></h2>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="flex animate-marquee-rtl">
          {[...firstRowTechnologies, ...firstRowTechnologies, ...firstRowTechnologies].map((tech, index) => (
            <Card
              key={`${tech.name}-${index}`}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 p-6 hover:shadow-lg hover:shadow-primary/5 flex-shrink-0 w-80 mx-4"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">{tech.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex animate-marquee-ltr">
          {[...secondRowTechnologies, ...secondRowTechnologies, ...secondRowTechnologies].map((tech, index) => (
            <Card
              key={`${tech.name}-${index}`}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 p-6 hover:shadow-lg hover:shadow-primary/5 flex-shrink-0 w-80 mx-4"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">{tech.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
