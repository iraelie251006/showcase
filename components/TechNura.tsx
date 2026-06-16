import { Cloud, Server, Layers, GaugeCircle, type LucideIcon } from 'lucide-react';

type Capability = {
  icon: LucideIcon;
  title: string;
  description: string;
  stack: string[];
};

const capabilities: Capability[] = [
  {
    icon: Layers,
    title: 'Web Applications',
    description: 'Production-grade Next.js apps with TypeScript fast, SEO-friendly, and built to scale with the business.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    icon: Server,
    title: 'Backend & APIs',
    description: 'Robust services with Express and Spring Boot, designed for shared state, load balancing, and fault tolerance.',
    stack: ['Express', 'Spring Boot', 'Redis'],
  },
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'AWS architectures across EC2, Lambda, ECS/Fargate, with Infrastructure-as-Code and automated CI/CD pipelines.',
    stack: ['AWS', 'Kubernetes', 'Docker'],
  },
  {
    icon: GaugeCircle,
    title: 'DevOps & Reliability',
    description: 'Multi-node deployments with HAProxy and Nginx, observability via CloudWatch, and zero-downtime release pipelines.',
    stack: ['HAProxy', 'Nginx', 'CloudWatch'],
  },
];

const TechNura = () => {
  return (
    <section>
      <h1 className="heading">
        The studio:
        <span className="text-purple"> TechNura</span>
      </h1>
      <div className="w-full mt-12 flex flex-col">
        <p className="text-sm lg:text-base font-light text-center">
          When I take on client work, it ships under <span className="text-purple font-bold">TechNura</span>. A studio I run, focused on modern, scalable digital products for startups and small businesses.
        </p>
        <p className="text-sm lg:text-base font-light text-center max-sm:mt-2">
          We design and build web and backend systems that are intuitive, performance-driven, and built to grow with the business.
        </p>

        <p className="text-center mt-5 font-light text-sm lg:text-base">
          Status: <span className="text-purple font-semibold">Operational</span> currently taking on selected engagements.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {capabilities.map(({ icon: Icon, title, description, stack }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-black-200 p-6 transition-all duration-300 hover:border-purple/50 hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(40rem_20rem_at_50%_-20%,rgba(203,172,249,0.18),transparent_60%)]" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-purple/30 bg-purple/10 text-purple">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base uppercase tracking-[0.16em] text-white">
                    {title}
                  </h3>
                </div>
                <p className="text-sm font-light text-white-200 leading-relaxed">
                  {description}
                </p>
                <ul className="flex flex-wrap gap-2 pt-1">
                  {stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white-100"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechNura;
