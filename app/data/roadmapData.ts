export const roadmapData = [
    {
        id: "web",
        label: "Full Stack Web",
        description: "Master the art of building modern web applications from front to back.",
        icon: "Globe",
        color: "from-purple-500 to-pink-500",
        roadmap: [
            { title: "HTML, CSS & JS", desc: "The building blocks of the web." },
            { title: "React & Tailwind", desc: "Modern UI development." },
            { title: "Next.js & TypeScript", desc: "Production-ready frameworks." },
            { title: "Node.js & Databases", desc: "Backend logic and data storage." },
            { title: "Deployment (Vercel/AWS)", desc: "Going live to the world." }
        ],
        resources: [
            {
                title: "React Documentation",
                type: "Documentation",
                desc: "The official guide to learning React.",
                link: "https://react.dev",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop"
            },
            {
                title: "Next.js 14 Course",
                type: "Video Course",
                desc: "Complete guide to App Router by Vercel.",
                link: "https://nextjs.org/learn",
                image: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=1000&auto=format&fit=crop"
            },
            {
                title: "Tailwind CSS Labs",
                type: "YouTube",
                desc: "Best practices for styling.",
                link: "https://youtube.com/@TailwindLabs",
                image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"
            }
        ]
    },
    {
        id: "ai",
        label: "AI & Data Science",
        description: "Dive into the world of intelligent algorithms and data analysis.",
        icon: "BrainCircuit",
        color: "from-blue-500 to-cyan-500",
        roadmap: [
            { title: "Python Fundamentals", desc: "The language of AI." },
            { title: "NumPy & Pandas", desc: "Data manipulation mastery." },
            { title: "Machine Learning (Scikit)", desc: "Predictive modeling." },
            { title: "Deep Learning (PyTorch)", desc: "Neural networks & LLMs." },
            { title: "Deployment (HuggingFace)", desc: "Sharing your models." }
        ],
        resources: [
            {
                title: "Fast.ai Course",
                type: "Course",
                desc: "Deep Learning for coders.",
                link: "https://course.fast.ai",
                image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
            },
            {
                title: "Hugging Face Docs",
                type: "Documentation",
                desc: "The GitHub of AI models.",
                link: "https://huggingface.co/docs",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"
            },
            {
                title: "Andrej Karpathy",
                type: "YouTube",
                desc: "Building GPT from scratch.",
                link: "https://youtube.com/@AndrejKarpathy",
                image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop"
            }
        ]
    },
    {
        id: "cyber",
        label: "Cybersecurity",
        description: "Protect systems and networks from digital attacks.",
        icon: "ShieldAlert",
        color: "from-red-500 to-orange-500",
        roadmap: [
            { title: "Networking Basics", desc: "TCP/IP, OSI Model." },
            { title: "Linux Command Line", desc: "Kali Linux mastery." },
            { title: "Web Security (OWASP)", desc: "Finding vulnerabilities." },
            { title: "Ethical Hacking", desc: "Penetration testing." },
            { title: "Forensics & Defense", desc: "Blue teaming skills." }
        ],
        resources: [
            {
                title: "TryHackMe",
                type: "Interactive",
                desc: "Gamified cyber security training.",
                link: "https://tryhackme.com",
                image: "https://images.unsplash.com/photo-1563206767-5b1d972f9fb9?q=80&w=1000&auto=format&fit=crop"
            },
            {
                title: "PortSwigger Academy",
                type: "Course",
                desc: "Web Security Academy.",
                link: "https://portswigger.net/web-security",
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop"
            }
        ]
    },
    {
        id: "blockchain",
        label: "Blockchain & Web3",
        description: "Decentralized applications and smart contracts.",
        icon: "Cpu",
        color: "from-emerald-500 to-green-500",
        roadmap: [
            { title: "Blockchain Basics", desc: "How ledgers work." },
            { title: "Solidity Development", desc: "Smart contracts on EVM." },
            { title: "Ethers.js / Viem", desc: "Connecting frontend to chain." },
            { title: "DeFi Protocols", desc: "Understanding finance on-chain." },
            { title: "Security Auditing", desc: "Writing safe contracts." }
        ],
        resources: [
            {
                title: "CryptoZombies",
                type: "Interactive",
                desc: "Learn Solidity by making a game.",
                link: "https://cryptozombies.io",
                image: "https://images.unsplash.com/photo-1621504450168-b8c034fea127?q=80&w=1000&auto=format&fit=crop"
            },
            {
                title: "Ethereum.org",
                type: "Documentation",
                desc: "Official developer resources.",
                link: "https://ethereum.org/en/developers/",
                image: "https://images.unsplash.com/photo-1622630998477-20aa696fa305?q=80&w=1000&auto=format&fit=crop"
            }
        ]
    },
    {
        id: "mobile",
        label: "Mobile Development",
        description: "Build native apps for iOS and Android.",
        icon: "Smartphone",
        color: "from-green-500 to-emerald-500",
        roadmap: [
            { title: "React Native / Flutter", desc: "Cross-platform development." },
            { title: "Native Concepts", desc: "Swift & Kotlin basics." },
            { title: "State Management", desc: "Redux, MobX, Provider." },
            { title: "App Store Deployment", desc: "Publishing your apps." }
        ],
        resources: [
            { title: "Flutter Docs", type: "Docs", desc: "Official Guide", link: "https://flutter.dev", image: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?q=80&w=1000&auto=format&fit=crop" }
        ]
    },
    {
        id: "devops",
        label: "DevOps & Cloud",
        description: "Bridge the gap between code and operations.",
        icon: "Cloud",
        color: "from-orange-500 to-red-500",
        roadmap: [
            { title: "Linux & Terminal", desc: "Command line mastery." },
            { title: "Docker & Kubernetes", desc: "Containerization." },
            { title: "CI/CD Pipelines", desc: "GitHub Actions, Jenkins." },
            { title: "AWS / Azure", desc: "Cloud infrastructure." }
        ],
        resources: [
            { title: "Docker Mastery", type: "Course", desc: "Zero to Hero", link: "https://www.udemy.com", image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000&auto=format&fit=crop" }
        ]
    },
    {
        id: "gamedev",
        label: "Game Development",
        description: "Create immersive 2D and 3D worlds.",
        icon: "Gamepad2",
        color: "from-purple-600 to-indigo-600",
        roadmap: [
            { title: "C# or C++", desc: "Programming Foundations." },
            { title: "Unity or Unreal", desc: "Choosing an engine." },
            { title: "Game Physics", desc: "Collisions and gravity." },
            { title: "3D Modeling Basics", desc: "Blender basics." }
        ],
        resources: []
    },
    {
        id: "uiux",
        label: "UI/UX Design",
        description: "Design beautiful and functional interfaces.",
        icon: "PenTool",
        color: "from-pink-500 to-rose-500",
        roadmap: [
            { title: "Design Theory", desc: "Typography, Color, Spacing." },
            { title: "Figma Mastery", desc: "Prototyping and Wireframing." },
            { title: "User Research", desc: "Understanding the user." }
        ],
        resources: []
    },
    {
        id: "dataeng",
        label: "Data Engineering",
        description: "Build robust data pipelines.",
        icon: "Database",
        color: "from-teal-500 to-cyan-500",
        roadmap: [
            { title: "SQL Mastery", desc: "Complex queries." },
            { title: "Python for Data", desc: "Pandas, ETL scripts." },
            { title: "Big Data Tools", desc: "Spark, Hadoop." }
        ],
        resources: []
    },
    {
        id: "arvr",
        label: "AR / VR",
        description: "Build for the spatial web.",
        icon: "Glasses",
        color: "from-violet-500 to-purple-500",
        roadmap: [
            { title: "Unity XR", desc: "VR Development." },
            { title: "WebXR", desc: "AR on the web." }
        ],
        resources: []
    },
    {
        id: "qa",
        label: "QA Automation",
        description: "Ensure software quality.",
        icon: "CheckSquare",
        color: "from-yellow-500 to-orange-500",
        roadmap: [
            { title: "Manual Testing", desc: "Test cases and bug reporting." },
            { title: "Selenium / Cypress", desc: "Automated browser testing." }
        ],
        resources: []
    },
    {
        id: "pm",
        label: "Product Management",
        description: "Lead successful tech products.",
        icon: "Kanban",
        color: "from-blue-600 to-indigo-600",
        roadmap: [
            { title: "Agile & Scrum", desc: "Development methodologies." },
            { title: "User Stories", desc: "Defining requirements." }
        ],
        resources: []
    },
    {
        id: "system",
        label: "System Design",
        description: "Architect scalable systems.",
        icon: "Server",
        color: "from-gray-500 to-slate-500",
        roadmap: [
            { title: "Load Balancing", desc: "Handling traffic." },
            { title: "Caching Strategies", desc: "Redis, CDNs." }
        ],
        resources: []
    },
    {
        id: "embedded",
        label: "Embedded Systems",
        description: "Code that runs on hardware.",
        icon: "Cpu",
        color: "from-emerald-600 to-green-600",
        roadmap: [
            { title: "C/C++", desc: "Low level coding." },
            { title: "Microcontrollers", desc: "Arduino, ESP32." }
        ],
        resources: []
    },
    {
        id: "mlops",
        label: "MLOps",
        description: "Deploy and monitor AI models.",
        icon: "Workflow",
        color: "from-indigo-500 to-blue-500",
        roadmap: [
            { title: "Model Packaging", desc: "Dockerizing models." },
            { title: "Model Monitoring", desc: "Drift detection." }
        ],
        resources: []
    },
    {
        id: "technical_writing",
        label: "Technical Writing",
        description: "Document software effectively.",
        icon: "FileText",
        color: "from-slate-500 to-gray-500",
        roadmap: [
            { title: "Markdown", desc: "Documentation standard." },
            { title: "API Docs", desc: "Swagger / OpenAPI." }
        ],
        resources: []
    }
];
