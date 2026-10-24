export const INITIAL_COURSES = [
  {
    id: 'c-1',
    title: 'Full-Stack Modern Web Engineering',
    slug: 'full-stack-modern-web-engineering',
    category: 'Web Development',
    level: 'Intermediate',
    price: 0,
    isPaid: false,
    duration: '12 Weeks',
    rating: 4.9,
    enrolledCount: 3420,
    instructor: 'Dr. Rajesh Nair & Tech Leads',
    badge: 'Popular',
    description: 'Master React, Node.js, Next.js patterns, Tailwind CSS, PostgreSQL, REST APIs, and modern cloud deployment architectures.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    curriculum: [
      {
        title: 'Module 1: Foundations of Modern Frontend',
        duration: '3 weeks',
        lessons: [
          { title: 'HTML5 Semantic Architecture & Accessibility (a11y)', duration: '45 mins' },
          { title: 'Modern CSS, Flexbox, Grid & Responsive Systems', duration: '60 mins' },
          { title: 'JavaScript ES2024+ Asynchronous Programming & Closures', duration: '75 mins' },
          { title: 'Component Driven Architecture with React', duration: '90 mins' }
        ]
      },
      {
        title: 'Module 2: State Management & Real-World APIs',
        duration: '4 weeks',
        lessons: [
          { title: 'React Hooks, Custom Hooks, and Context API', duration: '60 mins' },
          { title: 'Vite & Modern Tooling Ecosystem', duration: '40 mins' },
          { title: 'Client-Side Routing, Route Guards & Code Splitting', duration: '50 mins' },
          { title: 'Connecting RESTful Services & Supabase Backend', duration: '80 mins' }
        ]
      },
      {
        title: 'Module 3: Full-Stack Integration & Cloud Deployment',
        duration: '5 weeks',
        lessons: [
          { title: 'Database Design, RLS & Schema Migrations', duration: '65 mins' },
          { title: 'Authentication, Security Best Practices & JWT', duration: '55 mins' },
          { title: 'End-to-End Capstone Project Implementation', duration: '120 mins' },
          { title: 'CI/CD Pipelines, Docker Basics & Production Release', duration: '70 mins' }
        ]
      }
    ],
    prerequisites: ['Basic programming logic', 'Curiosity to build'],
    outcomes: [
      'Build scalable multi-page web applications with React',
      'Integrate Supabase Auth, Storage, and Realtime Database',
      'Deploy production-ready apps on Cloud platforms',
      'Qualify for Junior to Mid Full-Stack Web Developer roles'
    ]
  },
  {
    id: 'c-2',
    title: 'Data Structures, Algorithms & Problem Solving',
    slug: 'dsa-problem-solving',
    category: 'Computer Science',
    level: 'Beginner to Advanced',
    price: 1999,
    isPaid: true,
    duration: '10 Weeks',
    rating: 4.8,
    enrolledCount: 2890,
    instructor: 'Priya Sharma (Ex-Senior SWE)',
    badge: 'High Placement Rate',
    description: 'Cracking tech interviews through rigorous problem solving, graph theory, dynamic programming, and complexity analysis.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    curriculum: [
      {
        title: 'Module 1: Time & Space Complexity & Core Arrays',
        duration: '2 weeks',
        lessons: [
          { title: 'Big-O Notation & Asymptotic Bounds', duration: '40 mins' },
          { title: 'Array Manipulation, Two Pointers & Sliding Window', duration: '90 mins' },
          { title: 'Searching & Sorting Algorithms deep-dive', duration: '70 mins' }
        ]
      },
      {
        title: 'Module 2: Linked Lists, Stacks, Queues & Trees',
        duration: '4 weeks',
        lessons: [
          { title: 'Singly & Doubly Linked List Operations', duration: '60 mins' },
          { title: 'Stack Implementation & Monotonic Stack Problems', duration: '75 mins' },
          { title: 'Binary Trees, BST, DFS & BFS Traversals', duration: '90 mins' }
        ]
      },
      {
        title: 'Module 3: Advanced Graphs & Dynamic Programming',
        duration: '4 weeks',
        lessons: [
          { title: 'Graph Representations, Dijkstra & Topological Sort', duration: '100 mins' },
          { title: '1D & 2D Dynamic Programming Patterns', duration: '110 mins' },
          { title: 'Mock Coding Interviews & Whiteboarding Skills', duration: '60 mins' }
        ]
      }
    ],
    prerequisites: ['C++, Java, or Python basics'],
    outcomes: [
      'Solve medium to hard LeetCode algorithmic challenges',
      'Excel in top-tier company technical rounds',
      'Master memory footprints and algorithmic optimization'
    ]
  },
  {
    id: 'c-3',
    title: 'Cloud DevOps & Container Orchestration',
    slug: 'cloud-devops-kubernetes',
    category: 'Cloud Computing',
    level: 'Intermediate',
    price: 2499,
    isPaid: true,
    duration: '8 Weeks',
    rating: 4.9,
    enrolledCount: 1650,
    instructor: 'Karan Verma (Cloud Architect)',
    badge: 'Industry Essential',
    description: 'Hands-on practical mastery in Docker containerization, Kubernetes clusters, GitHub Actions CI/CD, and AWS/GCP cloud systems.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    curriculum: [
      {
        title: 'Module 1: Linux System Admin & Docker Containers',
        duration: '2.5 weeks',
        lessons: [
          { title: 'Essential Linux CLI & Shell Scripting', duration: '60 mins' },
          { title: 'Containerization Concepts & Dockerfile Multi-stage Builds', duration: '80 mins' },
          { title: 'Docker Compose & Multi-container Networks', duration: '70 mins' }
        ]
      },
      {
        title: 'Module 2: Kubernetes Cluster Architecture',
        duration: '3 weeks',
        lessons: [
          { title: 'Pods, Deployments, Services & Ingress Controllers', duration: '90 mins' },
          { title: 'ConfigMaps, Secrets and Persistent Volumes', duration: '85 mins' },
          { title: 'Cluster Monitoring with Prometheus & Grafana', duration: '75 mins' }
        ]
      },
      {
        title: 'Module 3: Continuous Integration & Deployment',
        duration: '2.5 weeks',
        lessons: [
          { title: 'GitHub Actions Workflows for Microservices', duration: '80 mins' },
          { title: 'Infrastructure as Code with Terraform Fundamentals', duration: '90 mins' }
        ]
      }
    ],
    prerequisites: ['Basic understanding of web servers'],
    outcomes: [
      'Automate builds and test suites with GitHub Actions',
      'Manage production Kubernetes deployments',
      'Architect highly available cloud environments'
    ]
  },
  {
    id: 'c-4',
    title: 'Modern UI/UX Design & Figma Systems',
    slug: 'modern-ui-ux-design-systems',
    category: 'UI/UX Design',
    level: 'Beginner',
    price: 0,
    isPaid: false,
    duration: '6 Weeks',
    rating: 4.7,
    enrolledCount: 4120,
    instructor: 'Aanya Sen (Product Designer)',
    badge: 'Zero Prerequisites',
    description: 'Learn wireframing, user research, typography, color harmony, prototyping, and building scalable design systems in Figma.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    curriculum: [
      {
        title: 'Module 1: Design Fundamentals & Psychology',
        duration: '2 weeks',
        lessons: [
          { title: 'Principles of Visual Hierarchy & Contrast', duration: '50 mins' },
          { title: 'Color Theory, Typography Scales & Spacing Rules', duration: '65 mins' }
        ]
      },
      {
        title: 'Module 2: Figma Mastery & Prototyping',
        duration: '2 weeks',
        lessons: [
          { title: 'Auto-layout, Components and Interactive Variants', duration: '80 mins' },
          { title: 'Mobile & Desktop Responsive Frames', duration: '70 mins' }
        ]
      },
      {
        title: 'Module 3: Design Handoff & Portfolio Project',
        duration: '2 weeks',
        lessons: [
          { title: 'Developer Handoff Best Practices & Tokens', duration: '55 mins' },
          { title: 'Building a Polished SaaS Case Study', duration: '90 mins' }
        ]
      }
    ],
    prerequisites: ['No prior experience needed'],
    outcomes: [
      'Create high-fidelity interactive Figma prototypes',
      'Design clean enterprise dashboards and responsive mobile apps',
      'Collaborate smoothly with frontend development teams'
    ]
  }
];

export const INITIAL_NOTES = [
  {
    id: 'n-1',
    title: 'React 19 & Next.js Architecture Comprehensive Guide',
    category: 'Web Development',
    pages: 64,
    format: 'PDF',
    isPaid: false,
    price: 0,
    downloadCount: 4210,
    description: 'Concise summary of server components, compiler hooks, suspense boundaries, hydration internals, and clean code patterns.',
    author: 'EduGrowth Tech Editorial',
    updatedDate: 'Oct 2026'
  },
  {
    id: 'n-2',
    title: 'System Design Interview Cheatsheet (HLD & LLD)',
    category: 'Software Engineering',
    pages: 92,
    format: 'PDF',
    isPaid: true,
    price: 499,
    downloadCount: 1840,
    description: 'High-level architectures for rate limiters, distributed caching, load balancers, database sharding, and message queues.',
    author: 'Principal Architect Guild',
    updatedDate: 'Oct 2026'
  },
  {
    id: 'n-3',
    title: 'Complete SQL & Database Schema Design Handbook',
    category: 'Database & Backend',
    pages: 58,
    format: 'PDF',
    isPaid: false,
    price: 0,
    downloadCount: 3950,
    description: 'PostgreSQL optimization, indexing strategies, normalization forms, transaction isolation levels, and RLS policies.',
    author: 'Database Working Group',
    updatedDate: 'Sep 2026'
  },
  {
    id: 'n-4',
    title: 'Data Structures Quick Reference Handbook',
    category: 'Algorithms',
    pages: 76,
    format: 'PDF',
    isPaid: true,
    price: 299,
    downloadCount: 2150,
    description: 'Memory layouts, standard implementations, recursion trees, and complexity charts for 30+ fundamental data structures.',
    author: 'Competitive Programming Mentors',
    updatedDate: 'Oct 2026'
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'p-1',
    title: 'DevPulse — Developer Collaboration & Code Review Hub',
    category: 'Full Stack',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: 'A collaborative code snippet review workspace featuring live inline commenting, syntax highlighting, and team project boards.',
    features: [
      'Real-time markdown and code diff viewer',
      'Role-based access control and team workspaces',
      'Webhook notifications and activity auditing'
    ],
    demoUrl: 'https://example.com/devpulse-demo',
    repoUrl: 'https://github.com/edugrowth-projects/devpulse'
  },
  {
    id: 'p-2',
    title: 'HealthSync — Smart Clinical Records & Appointment Portal',
    category: 'Healthcare Tech',
    techStack: ['React', 'Supabase', 'Tailwind CSS', 'Chart.js'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    description: 'HIPAA-conscious outpatient management system handling doctor schedules, electronic prescriptions, and diagnostic reports.',
    features: [
      'Slot reservation system with automated reminders',
      'Encrypted diagnostic file storage and downloads',
      'Doctor & patient dual-perspective dashboards'
    ],
    demoUrl: 'https://example.com/healthsync-demo',
    repoUrl: 'https://github.com/edugrowth-projects/healthsync'
  },
  {
    id: 'p-3',
    title: 'FinMetrics — Real-Time SaaS Revenue Analytics Engine',
    category: 'Fintech & Cloud',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'REST API'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    description: 'Enterprise business intelligence dashboard tracking MRR, churn rate, cohort retention, and customer lifetime value metrics.',
    features: [
      'Interactive metrics filtering and date ranges',
      'Exportable CSV and PDF executive reports',
      'Role-restricted financial overview panels'
    ],
    demoUrl: 'https://example.com/finmetrics-demo',
    repoUrl: 'https://github.com/edugrowth-projects/finmetrics'
  }
];

export const INITIAL_JOBS_AND_INTERNSHIPS = [
  {
    id: 'opp-1',
    type: 'JOB',
    title: 'Junior Frontend Software Engineer',
    organization: 'NovaTech Digital Solutions',
    location: 'Bengaluru / Remote',
    workMode: 'Hybrid',
    experience: '0-2 Years',
    salary: '₹6.5 - ₹9.0 LPA',
    deadline: '2026-11-30',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'Git', 'REST APIs'],
    eligibility: 'B.Tech/BE/BCA/MCA (2024, 2025, 2026 batches)',
    openings: 4,
    description: 'NovaTech is looking for proactive frontend engineers to build high-performance client dashboards and customer portals.',
    responsibilities: [
      'Develop responsive user interfaces using modern React and Tailwind CSS',
      'Collaborate with backend engineers to integrate RESTful APIs',
      'Write unit tests and maintain high browser compatibility standards',
      'Participate in sprint retrospectives and peer code reviews'
    ],
    postedDate: '2026-10-20'
  },
  {
    id: 'opp-2',
    type: 'INTERNSHIP',
    title: 'Full-Stack Developer Intern',
    organization: 'Apex Innovations Lab',
    location: 'Hyderabad / Remote',
    workMode: 'Remote',
    experience: 'Fresher / Students',
    salary: '₹22,000 / month Stipend (PPO Available)',
    deadline: '2026-11-15',
    skills: ['React', 'Node.js', 'Express', 'SQL', 'Git'],
    eligibility: 'Pre-final and Final year college students with strong CS fundamentals',
    openings: 6,
    description: '3-to-6 months intensive paid internship with direct mentorship from senior engineering architects. Pre-Placement Offer (PPO) for high performers.',
    responsibilities: [
      'Contribute to our internal microservices and React dashboards',
      'Create documentation and participate in daily standups',
      'Work closely with assigned industry mentors'
    ],
    postedDate: '2026-10-18'
  },
  {
    id: 'opp-3',
    type: 'JOB',
    title: 'Cloud DevOps & Systems Associate',
    organization: 'CloudScale Infrastructure',
    location: 'Pune / Remote',
    workMode: 'Remote',
    experience: '1-3 Years',
    salary: '₹8.0 - ₹12.0 LPA',
    deadline: '2026-12-05',
    skills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS / GCP'],
    eligibility: 'Degree in CS/IT or relevant certifications with cloud experience',
    openings: 3,
    description: 'Help manage mission-critical cloud deployments, monitor Kubernetes clusters, and streamline release automation pipelines.',
    responsibilities: [
      'Maintain uptime of containerized staging and production clusters',
      'Build automated CI/CD workflows using GitHub Actions',
      'Implement cloud security audits and cost monitoring tools'
    ],
    postedDate: '2026-10-22'
  },
  {
    id: 'opp-4',
    type: 'INTERNSHIP',
    title: 'UI/UX Design & Product Intern',
    organization: 'Elevate Design Studio',
    location: 'Delhi NCR / Remote',
    workMode: 'Hybrid',
    experience: 'Fresher / Portfolio',
    salary: '₹18,000 / month Stipend',
    deadline: '2026-11-20',
    skills: ['Figma', 'Wireframing', 'User Research', 'Design Systems'],
    eligibility: 'Students or recent graduates with a strong Figma portfolio',
    openings: 2,
    description: 'Design captivating web applications, mobile interfaces, and marketing visuals with our creative design team.',
    responsibilities: [
      'Create user journey maps, wireframes, and prototypes in Figma',
      'Assist in conducting usability tests with real students and users',
      'Maintain design system component tokens and documentation'
    ],
    postedDate: '2026-10-19'
  }
];

export const INITIAL_SERVICES = [
  {
    id: 's-1',
    title: 'Website Development',
    icon: 'Globe',
    shortDesc: 'High-speed, SEO-optimized, responsive custom web applications built with modern React ecosystems.',
    details: 'From corporate brand portals to dynamic multi-page web applications, we engineer lightning-fast digital experiences with clean architectural discipline.'
  },
  {
    id: 's-2',
    title: 'Software Development',
    icon: 'Code2',
    shortDesc: 'Enterprise web apps, cloud backends, database architecture, and custom internal business tools.',
    details: 'Custom software designed for long-term scalability, robust security, maintainable codebases, and seamless API integrations.'
  },
  {
    id: 's-3',
    title: 'Technology Solutions',
    icon: 'Cpu',
    shortDesc: 'Cloud migration, DevOps workflows, infrastructure architecture, and technical consulting.',
    details: 'Modernize legacy systems, automate continuous delivery pipelines, and optimize cloud expenditure across AWS, GCP, and modern PaaS.'
  },
  {
    id: 's-4',
    title: 'Digital Solutions',
    icon: 'Layers',
    shortDesc: 'UI/UX design systems, accessibility audits, digital workflows, and interactive client portals.',
    details: 'Transform customer interactions through human-centered user experiences, cohesive design systems, and rapid prototyping.'
  },
  {
    id: 's-5',
    title: 'Training and Workshops',
    icon: 'GraduationCap',
    shortDesc: 'Corporate tech training, college bootcamps, and engineering upskilling programs.',
    details: 'Empower student cohorts and corporate teams with hands-on curriculums in Full-Stack development, Cloud, Data, and System Design.'
  },
  {
    id: 's-6',
    title: 'Business Development Support',
    icon: 'TrendingUp',
    shortDesc: 'Market validation, product-market fit analysis, and technical advisory for startups.',
    details: 'Strategic technical guidance helping emerging startups formulate technology roadmaps, MVP specifications, and growth execution.'
  },
  {
    id: 's-7',
    title: 'Digital Growth',
    icon: 'BarChart3',
    shortDesc: 'Data analytics, performance optimization, conversion engineering, and search visibility.',
    details: 'Harness actionable web metrics, Core Web Vitals optimization, and data-driven iterations to accelerate audience acquisition.'
  },
  {
    id: 's-8',
    title: 'Industry Collaboration',
    icon: 'Building2',
    shortDesc: 'Bridging academic institutions with technology enterprises for placements and capstones.',
    details: 'Connecting universities and colleges with active tech companies for hiring drives, hackathons, and sponsored student capstone projects.'
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    opportunityId: 'opp-1',
    opportunityTitle: 'Junior Frontend Software Engineer',
    organization: 'NovaTech Digital Solutions',
    applicantName: 'Suraj Kumar',
    applicantEmail: 'surajkumar754100@gmail.com',
    applicantPhone: '+91 9876543210',
    college: 'Indian Institute of Information Technology',
    status: 'Shortlisted', // Applied, Reviewing, Shortlisted, Interview, Selected, Rejected, Completed
    appliedDate: '2026-10-21',
    notes: 'Candidate passed initial portfolio screening with notable React projects.'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-2',
    opportunityTitle: 'Full-Stack Developer Intern',
    organization: 'Apex Innovations Lab',
    applicantName: 'Suraj Kumar',
    applicantEmail: 'surajkumar754100@gmail.com',
    applicantPhone: '+91 9876543210',
    college: 'Indian Institute of Information Technology',
    status: 'Interview',
    appliedDate: '2026-10-22',
    notes: 'Technical round scheduled for Thursday 3:00 PM.'
  },
  {
    id: 'app-3',
    opportunityId: 'opp-4',
    opportunityTitle: 'UI/UX Design & Product Intern',
    organization: 'Elevate Design Studio',
    applicantName: 'Aditi Patel',
    applicantEmail: 'aditi.patel@example.com',
    applicantPhone: '+91 9123456789',
    college: 'National Institute of Design',
    status: 'Reviewing',
    appliedDate: '2026-10-23',
    notes: 'Figma case studies under evaluation by lead designer.'
  }
];

export const INITIAL_ENQUIRIES = [
  {
    id: 'enq-1',
    fullName: 'Ramesh Verma',
    email: 'ramesh.verma@techacademy.edu',
    phone: '+91 9811223344',
    organization: 'Delhi Technological University',
    inquiryType: 'Course or Training',
    message: 'We want to organize a 4-week React & Cloud DevOps boot camp for our 3rd-year engineering cohort of 120 students.',
    status: 'Pending',
    createdAt: '2026-10-23'
  },
  {
    id: 'enq-2',
    fullName: 'Neha Kapoor',
    email: 'neha@growfastventures.com',
    phone: '+91 9722334455',
    organization: 'GrowFast Ventures',
    inquiryType: 'Technology Services',
    message: 'Seeking a dedicated development team to build our MVP customer portal with Supabase backend and React frontend.',
    status: 'In Progress',
    createdAt: '2026-10-22'
  },
  {
    id: 'enq-3',
    fullName: 'Deepak Rao',
    email: 'deepak.rao@cloudstride.io',
    phone: '+91 9633445566',
    organization: 'CloudStride Labs',
    inquiryType: 'Industry Collaboration',
    message: 'Interested in partnering with EduGrowth to source qualified full-stack developer interns for our Bengaluru engineering center.',
    status: 'Resolved',
    createdAt: '2026-10-20'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1001',
    studentName: 'Suraj Kumar',
    studentEmail: 'surajkumar754100@gmail.com',
    itemType: 'Course',
    itemTitle: 'Data Structures, Algorithms & Problem Solving',
    amount: 1999,
    status: 'Successful',
    paymentMethod: 'UPI / NetBanking',
    date: '2026-10-21'
  },
  {
    id: 'tx-1002',
    studentName: 'Aman Singhania',
    studentEmail: 'aman.s@example.com',
    itemType: 'Resource Note',
    itemTitle: 'System Design Interview Cheatsheet (HLD & LLD)',
    amount: 499,
    status: 'Successful',
    paymentMethod: 'Credit Card',
    date: '2026-10-22'
  },
  {
    id: 'tx-1003',
    studentName: 'Kavita Joshi',
    studentEmail: 'kavita.j@example.com',
    itemType: 'Course',
    itemTitle: 'Cloud DevOps & Container Orchestration',
    amount: 2499,
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    date: '2026-10-23'
  },
  {
    id: 'tx-1004',
    studentName: 'Vikram Mehta',
    studentEmail: 'vikram.m@example.com',
    itemType: 'Resource Note',
    itemTitle: 'Data Structures Quick Reference Handbook',
    amount: 299,
    status: 'Failed',
    paymentMethod: 'UPI (Timed Out)',
    date: '2026-10-23'
  }
];
