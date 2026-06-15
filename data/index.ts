export const navItems = [
    { name: "About", link: "/#about" },
    { name: "Projects", link: "/#projects" },
    { name: "Testimonials", link: "/#testimonials" },
    { name: "Blog", link: "/blog" },
    { name: "Contact", link: "/#contact" },
  ];

  export const gridItems = [
    {
      id: 1,
      title: "I thrive in collaborative engineering environments, with a focus on clean code and clear communication.",
      description: "",
      className: "lg:col-span-2 md:col-span-6 md:row-span-2 lg:min-h-[60vh]",
      imgClassName: "w-full h-full",
      titleClassName: "justify-end",
      img: "/b1.svg",
      spareImg: "",
    },
    {
      id: 2,
      title: "I'm very flexible with time zone communications",
      description: "",
      className: "lg:col-span-1 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "flex justify-center z-50 items-center",
      img: "",
      spareImg: "",
    },
    {
      id: 3,
      title: "My tech stack",
      description: `I constantly try to improve`,
      className: "lg:col-span-1 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center",
      img: "",
      spareImg: "",
    },
    {
      id: 4,
      title: "Tech enthusiast with a passion for development.",
      description: "",
      className: "lg:col-span-1 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "/grid.svg",
      spareImg: "/b4.svg",
    },
    {
      id: 5,
      title: "I'm currently executing Cloud track.",
      description: "I'm currently executing a structured 49-day AWS cloud engineering roadmap covering EC2, S3, Lambda, ECS/Fargate, CI/CD pipelines (CodePipeline + CloudWatch), Auto Scaling, and Infrastructure as Code (CloudFormation/CDK).",
      className: "md:col-span-2 md:row-span-2",
      imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
      titleClassName: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spareImg: "/grid.svg",
    },
    {
      id: 6,
      title: "Do you want to start a project together?",
      description: "",
      className: "lg:col-span-1 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spareImg: "",
    },
  ];
  
  export const projects = [
    {  
      id: 1,
      title: "NetSentry",
      des: "Real-time domain security analyzer deployed on AWS with Kubernetes, load balancing, and CI/CD.",
      img: "/netsentry.png",
      iconLists: ["/skills/aws.svg", "/skills/kubernetes.svg", "/skills/docker.svg", "/skills/nginx.svg", "/skills/redis.svg"],
      link: "https://netsentry.iraelie.tech",
    },
    {
      id: 2,
      title: "Devflow",
      des: "Devflow is a web application designed to streamline the workflow of developers, providing feature for finding jobs, collaboration, and code sharing.",
      img: "/devflow.jpeg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/fm.svg"],
      link: "https://devflow-blue.vercel.app",
    },
  ];
  
  export const testimonials = [
    {
      quote:
        "As the Co-founder and CEO of VOLTSOL GLOBAL Ltd, I am very satisfied with his performance and the final outcome of our website. I highly recommend Elie to any company or business looking for a reliable and skilled professional to create or manage their website. I strongly encourage others to give him the opportunity to work with them.",
      name: "Harerimana Thierry",
      image: "/thierry.jpeg",
      title: "CEO of Voltsol Global",
    },
    {
      quote:
        "We in landmark Logistics ltd, highly appreciate the way you Built our website with Extream Expertise in your proffesional Arsenal in your designing Hands! We are looking forward to the boosting of our future Business as a result of this attracting website built by your Great House! Thank you Once again.",
      name: "SIBONIYO Theohile",
      image: "/theo.jpeg",
      title: "Managing Director of Landmark Logistics Ltd",
    },
  ];
  
  export const workExperience = [
    {
      id: 1,
      title: "Security-Focused SRE Practice",
      desc: "Identified medium-to-critical vulnerabilities in production systems at Irembo, applying shift-left security principles to reliability engineering workflows.",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Distributed Systems Engineering",
      desc: "Designed and implemented scalable backend services using Spring Boot and Express.js, applying distributed systems patterns for shared state, load balancing, and fault tolerance.",
      className: "md:col-span-2",
      thumbnail: "/exp2.svg",
    },
    {
      id: 3,
      title: "DevOps Infrastructure",
      desc: "Built and operated a multi-node environment (Web01, Web02, Lb01) with HAProxy, Nginx, and PM2. Simulating production-grade deployment pipelines and load balancing at scale.",
      className: "md:col-span-2",
      thumbnail: "/exp3.svg",
    },
    {
      id: 4,
      title: "Container Orchestration at Scale",
      desc: "Deployed and managed containerized workloads using Kubernetes, implementing auto-scaling, rolling deployments, and self-healing infrastructure patterns used in hyperscale environments.",
      className: "md:col-span-2",
      thumbnail: "/exp4.svg",
    },
  ];
  
  export const socialMedia = [
    {
      id: 1,
      img: "/git.svg",
      link: "https://github.com/iraelie251006",
      className: "hover:opacity-100 opacity-75"
    },
    {
      id: 2,
      img: "/link.svg",
      link: "https://www.linkedin.com/in/irakoze-elie/",
      className: "hover:opacity-100 opacity-75"
    },
  ];
