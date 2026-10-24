-- ====================================================================
-- EduGrowth Platform - Realistic Seed Data (Part 4/5)
-- Populates courses, lessons, resources, projects, jobs, internships,
-- services, and enquiry categories.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. COURSES SEED
-- --------------------------------------------------------------------
INSERT INTO public.courses (id, title, slug, description, category, difficulty, duration, price, currency, thumbnail_path, status)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'Full-Stack Modern Web Engineering',
    'full-stack-modern-web-engineering',
    'Master React, Node.js, Next.js patterns, Tailwind CSS, PostgreSQL, REST APIs, and modern cloud deployment architectures.',
    'Web Development',
    'Intermediate',
    '12 Weeks',
    0.00,
    'INR',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'published'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Data Structures, Algorithms & Problem Solving in C++/Java',
    'dsa-algorithms-problem-solving',
    'Conquer arrays, trees, dynamic programming, graph theory, greedy strategies, and cracking product engineering coding rounds.',
    'Computer Science',
    'Beginner',
    '10 Weeks',
    0.00,
    'INR',
    'https://images.unsplash.com/photo-1516116211227-bbc03e3345a0?w=800&auto=format&fit=crop&q=80',
    'published'
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Practical Cloud DevOps & Microservices Infrastructure',
    'cloud-devops-microservices',
    'Docker containerization, Kubernetes orchestration, CI/CD GitHub Actions pipelines, Linux systems, and cloud monitoring.',
    'DevOps & Cloud',
    'Advanced',
    '8 Weeks',
    1499.00,
    'INR',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'published'
),
(
    'c0000000-0000-0000-0000-000000000004',
    'Machine Learning & Applied Generative AI Foundations',
    'machine-learning-generative-ai',
    'Python data pipelines, Scikit-Learn, PyTorch basics, Vector databases, LLM prompting, and RAG architectural implementations.',
    'Artificial Intelligence',
    'Intermediate',
    '10 Weeks',
    1999.00,
    'INR',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    'published'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    status = EXCLUDED.status;

-- --------------------------------------------------------------------
-- 2. COURSE SECTIONS & LESSONS SEED
-- --------------------------------------------------------------------
-- Sections for Course 1
INSERT INTO public.course_sections (id, course_id, title, sort_order)
VALUES
('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Module 1: Foundations of Modern Frontend', 1),
('s0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Module 2: React State, Hooks & Component Systems', 2),
('s0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Module 3: PostgreSQL & Supabase Backend Integration', 3)
ON CONFLICT (id) DO NOTHING;

-- Lessons for Course 1
INSERT INTO public.lessons (id, course_id, section_id, title, description, content, duration, sort_order, is_free_preview, status)
VALUES
(
    'l0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000001',
    'HTML5 Semantic Architecture & Accessibility (a11y)',
    'Learn how semantic HTML drives assistive tech, clean DOM trees, and SEO compliance.',
    '# HTML5 Semantic Architecture\n\nSemantic HTML provides structural meaning beyond visual rendering. Key elements include `<main>`, `<article>`, `<section>`, `<nav>`, and `<aside>`.\n\n### Best Practices\n1. Always provide descriptive headings.\n2. Ensure visible focus outlines.\n3. Include appropriate ARIA labels for assistive technologies.',
    '45 mins',
    1,
    TRUE, -- Free Preview
    'published'
),
(
    'l0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000001',
    'Modern CSS, Flexbox, Grid & Responsive Systems',
    'Deep dive into fluid typography, CSS custom properties, and container queries.',
    '# Modern CSS Systems\n\nMaster Flexbox for 1D alignments and CSS Grid for 2D macro layouts. Always implement mobile-first media queries.',
    '60 mins',
    2,
    FALSE,
    'published'
),
(
    'l0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000002',
    'React 19 Hooks, State Machines & Context Optimization',
    'Manage predictable state transitions without unnecessary re-renders.',
    '# React 19 State Patterns\n\nExplore `useState`, `useReducer`, and modern action hooks. Leverage clean component decoupling.',
    '75 mins',
    3,
    FALSE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 3. LEARNING RESOURCES (Notes & Study Materials)
-- --------------------------------------------------------------------
INSERT INTO public.learning_resources (id, title, description, category, file_path, preview_info, price, currency, is_free, status)
VALUES
(
    'r0000000-0000-0000-0000-000000000001',
    'React 19 & Next.js Architecture Comprehensive Guide',
    'Concise summary of server components, compiler hooks, suspense boundaries, hydration internals, and clean code patterns.',
    'Web Development',
    'learning-resources/react-19-guide.pdf',
    '64-page PDF covering hooks, suspense, and production build optimization.',
    0.00,
    'INR',
    TRUE,
    'published'
),
(
    'r0000000-0000-0000-0000-000000000002',
    'Top 100 SDE Technical Interview Questions & Solutions',
    'In-depth breakdowns of algorithmic patterns, recursion trees, dynamic programming memoization tables, and time complexity proof.',
    'DSA & Interview',
    'learning-resources/sde-interview-prep.pdf',
    'Handwritten diagrams, optimal complexity analysis, and C++/Java/Python solutions.',
    0.00,
    'INR',
    TRUE,
    'published'
),
(
    'r0000000-0000-0000-0000-000000000003',
    'High-Level System Design & Microservices Blueprint',
    'Production architectural patterns: Rate limiting, consistent hashing, distributed caching with Redis, message queues, and CAP theorem.',
    'System Design',
    'learning-resources/system-design-blueprint.pdf',
    'Architectural schematics, traffic calculations, and database sharding walkthroughs.',
    499.00,
    'INR',
    FALSE,
    'published'
),
(
    'r0000000-0000-0000-0000-000000000004',
    'PostgreSQL Query Optimization & Database Indexing Handbook',
    'Execution plans, EXPLAIN ANALYZE, B-tree indexes, composite indexes, VACUUM tuning, and Row Level Security implementation.',
    'Databases',
    'learning-resources/postgres-indexing-handbook.pdf',
    'Comprehensive guide to relational database performance engineering.',
    299.00,
    'INR',
    FALSE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 4. PROJECTS SEED
-- --------------------------------------------------------------------
INSERT INTO public.projects (id, title, slug, description, category, technology_stack, image_path, demo_url, repository_url, status)
VALUES
(
    'p0000000-0000-0000-0000-000000000001',
    'DevPulse — Developer Collaboration & Code Review Hub',
    'devpulse-developer-collaboration',
    'A collaborative code snippet review workspace featuring live comments, syntax highlighting, diff visualization, and GitHub OAuth integration.',
    'Full Stack',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'],
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    'https://devpulse.example.com',
    'https://github.com/example/devpulse',
    'published'
),
(
    'p0000000-0000-0000-0000-000000000002',
    'CloudVault — Zero-Knowledge Encrypted Asset Repository',
    'cloudvault-secure-asset-repository',
    'Client-side AES-256-GCM file encryption pipeline with cloud object storage chunking, signed download URLs, and access audit trails.',
    'Cybersecurity & Cloud',
    ARRAY['React', 'WebCrypto API', 'Supabase Storage', 'PostgreSQL'],
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    'https://cloudvault.example.com',
    'https://github.com/example/cloudvault',
    'published'
),
(
    'p0000000-0000-0000-0000-000000000003',
    'EduGrowth LMS & Career Ecosystem',
    'edugrowth-lms-career-platform',
    'An integrated platform combining student learning management, career opportunities, mentor matching, and administrative dashboards.',
    'EdTech & Career',
    ARRAY['React', 'Tailwind CSS', 'Supabase PostgreSQL', 'RLS', 'Edge Functions'],
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
    'https://edugrowth.example.com',
    'https://github.com/example/edugrowth',
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 5. JOBS SEED
-- --------------------------------------------------------------------
INSERT INTO public.jobs (id, title, organization_name, department, job_type, location, work_mode, experience, required_skills, eligibility, responsibilities, deadline, description, allow_guest_applications, status)
VALUES
(
    'j0000000-0000-0000-0000-000000000001',
    'Junior Frontend Software Engineer',
    'NovaTech Digital Solutions',
    'Engineering',
    'Full-Time',
    'Bengaluru / Remote',
    'Hybrid',
    '0-2 Years',
    ARRAY['React', 'JavaScript', 'Tailwind CSS', 'Git', 'REST APIs'],
    'B.Tech/BE/BCA/MCA (2024, 2025, 2026 batches)',
    'Develop responsive user interfaces using modern React and Tailwind CSS; Collaborate with backend engineers to integrate RESTful APIs; Write unit tests and maintain high browser compatibility standards.',
    '2026-11-30',
    'NovaTech is looking for proactive frontend engineers to build high-performance client dashboards and customer portals.',
    FALSE,
    'published'
),
(
    'j0000000-0000-0000-0000-000000000002',
    'Junior Backend & Cloud Associate',
    'CloudMatrix Systems',
    'Infrastructure',
    'Full-Time',
    'Hyderabad / Remote',
    'Remote',
    '1-3 Years',
    ARRAY['Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Linux'],
    'B.Tech/BE in CS/IT/ECE with minimum 65% aggregate',
    'Design and maintain PostgreSQL schemas, indexes, and queries; Build performant Node.js REST API endpoints; Implement secure JWT and RBAC authentication.',
    '2026-12-15',
    'CloudMatrix is hiring backend associates to power high-throughput microservices for global logistics clients.',
    FALSE,
    'published'
),
(
    'j0000000-0000-0000-0000-000000000003',
    'Content & Curriculum Associate',
    'EduGrowth Global Academy',
    'Education & Content',
    'Full-Time',
    'Delhi NCR / Remote',
    'Remote',
    '0-1 Year',
    ARRAY['Technical Writing', 'Computer Science Fundamentals', 'Curriculum Design'],
    'Graduates in Computer Science, IT, or related fields with strong English communication',
    'Author concise technical cheat sheets, learning guides, and practical lab exercises; Review code examples for clarity and standards.',
    '2026-11-20',
    'Join EduGrowth to shape educational roadmaps and help thousands of students transition from beginners to job-ready software developers.',
    TRUE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 6. INTERNSHIPS SEED
-- --------------------------------------------------------------------
INSERT INTO public.internships (id, title, organization_name, duration, stipend, work_mode, location, required_skills, eligibility, deadline, description, allow_guest_applications, status)
VALUES
(
    'i0000000-0000-0000-0000-000000000001',
    'Full-Stack Developer Intern',
    'Apex Innovations Lab',
    '6 Months',
    '₹20,000 / month',
    'Remote',
    'Hyderabad / Remote',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    'Pre-final and final year college students available for 6 months internship',
    '2026-11-15',
    'Work directly alongside senior architects to build and deploy customer-facing web applications with PPO conversion potential.',
    TRUE,
    'published'
),
(
    'i0000000-0000-0000-0000-000000000002',
    'UI/UX Design & Frontend Intern',
    'PixelCraft Studio',
    '3 Months',
    '₹15,000 / month',
    'Hybrid',
    'Bengaluru',
    ARRAY['Figma', 'HTML/CSS', 'Tailwind CSS', 'Responsive Layouts'],
    'Students or self-taught designers with an active Figma portfolio and basic HTML/CSS knowledge',
    '2026-11-25',
    'Translate Figma component systems into clean HTML/CSS/Tailwind templates and conduct student usability interviews.',
    TRUE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 7. SERVICES SEED
-- --------------------------------------------------------------------
INSERT INTO public.services (id, title, description, category, icon, features, status)
VALUES
(
    's0000000-0000-0000-0000-000000000001',
    'Website Development',
    'High-speed, SEO-optimized, responsive custom web applications built with modern React ecosystems.',
    'Web Engineering',
    'Globe',
    ARRAY['Responsive Design', 'Vite & Next.js Performance', 'SEO Schema & OpenGraph', 'Accessible Semantic HTML'],
    'published'
),
(
    's0000000-0000-0000-0000-000000000002',
    'Software Development',
    'End-to-end full-stack software applications featuring robust relational database schemas, secure RBAC, and reliable RESTful APIs.',
    'Custom Software',
    'Code',
    ARRAY['Relational PostgreSQL Architecture', 'Row Level Security Policies', 'REST API Design', 'Automated Testing'],
    'published'
),
(
    's0000000-0000-0000-0000-000000000003',
    'Technology Solutions & Cloud Architecture',
    'Scalable cloud infrastructure, database indexing, automated CI/CD pipelines, containerization, and enterprise integrations.',
    'Cloud & Infrastructure',
    'Server',
    ARRAY['Docker Containerization', 'Cloud Deployment Workflows', 'Database Indexing & Tuning', 'High Availability Setups'],
    'published'
),
(
    's0000000-0000-0000-0000-000000000004',
    'Training & Practical Workshops',
    'Hands-on developer upskilling bootcamps for colleges, corporate teams, and engineering cohorts led by industry practitioners.',
    'Education & Upskilling',
    'BookOpen',
    ARRAY['Hands-on Project Sprints', 'Code Review Mentorship', 'Interview Prep Curricula', 'Placement Enablement'],
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 8. SAMPLE MENTOR APPLICATIONS SEED
-- --------------------------------------------------------------------
INSERT INTO public.mentor_applications (id, name, email, phone, current_role, organization, skills, experience, topics, linkedin_url, github_url, reason, availability, status)
VALUES
(
    'm0000000-0000-0000-0000-000000000001',
    'Kavish Deshmukh',
    'kavish.d@techscale.io',
    '+91 9988776655',
    'Staff Software Engineer',
    'FinScale Technologies',
    ARRAY['System Design', 'Go', 'Distributed Systems', 'Kubernetes'],
    '8 Years',
    ARRAY['System Design Interviews', 'Microservices', 'Career Growth'],
    'https://linkedin.com/in/kavish-deshmukh',
    'https://github.com/kavishd',
    'I want to give back to aspiring engineers and help college students master real-world distributed systems.',
    'Weekends (4-6 hours)',
    'Approved'
),
(
    'm0000000-0000-0000-0000-000000000002',
    'Pooja Sen',
    'pooja.sen@cloudmatrix.dev',
    '+91 9876501234',
    'Senior Frontend Architect',
    'PixelScale Studio',
    ARRAY['React', 'Next.js', 'Web Performance', 'Design Systems'],
    '6 Years',
    ARRAY['Frontend Architecture', 'Portfolio Review', 'Mock Interviews'],
    'https://linkedin.com/in/pooja-sen',
    'https://github.com/poojasen',
    'Passionate about mentoring young developers in writing accessible, high-performance UI code.',
    'Saturdays (2-4 hours)',
    'Pending'
)
ON CONFLICT (id) DO NOTHING;
