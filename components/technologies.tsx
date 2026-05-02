import Image from "next/image";

export default function TechnologiesSection() {
  const skillGroups = [
    {
      title: "DevOps & Cloud",
      skills: [
        { name: "AWS", icon: "/skills/aws.svg" },
        { name: "Docker", icon: "/skills/docker.svg" },
        { name: "Kubernetes", icon: "/skills/kubernetes.svg" },
        { name: "Redis", icon: "/skills/redis.svg" },
        { name: "Nginx", icon: "/skills/nginx.svg" }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Spring Boot", icon: "/skills/spring-boot.svg" },
        { name: "Java", icon: "/skills/java.svg" },
        { name: "Python", icon: "/skills/python.svg" },
        { name: "PostgreSQL", icon: "/skills/postgresql.svg" },
        { name: "MongoDB", icon: "/skills/mongodb.svg" },
        { name: "MySQL", icon: "/skills/mysql.svg" }
      ]
    },
    {
      title: "Frontend",
      skills: [
        { name: "React", icon: "/skills/react.svg" },
        { name: "Next.js", icon: "/skills/nextjs.svg" },
        { name: "TypeScript", icon: "/skills/typescript.svg" },
        { name: "JavaScript", icon: "/skills/javascript.svg" }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-sm md:max-w-full mt-10 gap-10 flex flex-wrap justify-center items-start">
      {skillGroups.map((group, index) => (
        <div key={index} style={{ opacity: 1, transform: 'none' }}>
          <h3 className="flex justify-center">{group.title}</h3>
          <ul 
            className="border border-gray-200 dark:border-gray-700 p-2 rounded-2xl bg-transparent sm:bg-white/50 dark:sm:bg-slate-800/50 gap-2 flex flex-wrap max-w-[20.1rem] justify-center" 
            style={{ opacity: 1 }}
          >
            {group.skills.map((skill, skillIndex) => (
              <li 
                key={skillIndex}
                className="flex flex-col gap-4 justify-center items-center text-center border border-gray-200 dark:border-gray-700 rounded-lg p-2 size-24 sm:size-24 text-sm sm:text-base bg-white/50 sm:bg-sky-50 dark:bg-slate-800/20 dark:sm:bg-slate-800/30"
              >
                <Image
                  draggable="false"
                  alt={`${skill.name} icon`}
                  loading="lazy"
                  width={30}
                  height={30}
                  decoding="async"
                  className="dark:opacity-80"
                  src={skill.icon}
                  style={{ color: 'transparent' }}
                />
                <p className="leading-4">{skill.name}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
