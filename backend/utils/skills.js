// Comprehensive predefined skills taxonomy
const SKILLS = {
  programming: [
    "javascript", "typescript", "python", "java", "c++", "c#", "c", "go", "golang",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl",
    "bash", "shell", "powershell", "dart", "elixir", "haskell", "lua", "groovy",
    "objective-c", "assembly", "cobol", "fortran", "vba",
  ],
  frontend: [
    "react", "reactjs", "react.js", "vue", "vuejs", "vue.js", "angular", "angularjs",
    "svelte", "nextjs", "next.js", "nuxtjs", "nuxt.js", "gatsby", "html", "html5",
    "css", "css3", "sass", "scss", "less", "tailwind", "tailwindcss", "bootstrap",
    "material-ui", "mui", "chakra-ui", "styled-components", "redux", "zustand",
    "mobx", "recoil", "webpack", "vite", "parcel", "rollup", "babel", "eslint",
    "prettier", "jest", "cypress", "playwright", "storybook", "graphql", "apollo",
    "axios", "fetch", "pwa", "webassembly", "three.js", "d3.js", "d3",
  ],
  backend: [
    "node.js", "nodejs", "express", "expressjs", "fastapi", "django", "flask",
    "spring", "spring boot", "springboot", "laravel", "rails", "ruby on rails",
    "asp.net", ".net", "dotnet", "nestjs", "nest.js", "koa", "hapi", "fastify",
    "graphql", "rest", "restful", "api", "microservices", "grpc", "websocket",
    "socket.io", "celery", "rabbitmq", "kafka", "redis", "nginx", "apache",
  ],
  database: [
    "mysql", "postgresql", "postgres", "mongodb", "sqlite", "redis", "elasticsearch",
    "cassandra", "dynamodb", "firebase", "firestore", "supabase", "oracle",
    "mssql", "sql server", "mariadb", "neo4j", "couchdb", "influxdb", "prisma",
    "sequelize", "typeorm", "mongoose", "knex", "sql", "nosql", "orm",
  ],
  cloud: [
    "aws", "amazon web services", "azure", "google cloud", "gcp", "heroku",
    "digitalocean", "vercel", "netlify", "cloudflare", "linode", "ec2", "s3",
    "lambda", "cloudwatch", "ecs", "eks", "fargate", "rds", "sqs", "sns",
    "api gateway", "cloud functions", "app engine", "kubernetes", "k8s",
    "docker", "docker-compose", "terraform", "ansible", "pulumi", "cloudformation",
  ],
  devops: [
    "ci/cd", "cicd", "jenkins", "github actions", "gitlab ci", "circleci",
    "travis ci", "argocd", "spinnaker", "helm", "prometheus", "grafana",
    "datadog", "splunk", "elk stack", "logstash", "kibana", "monitoring",
    "devops", "sre", "devsecops", "git", "github", "gitlab", "bitbucket",
    "agile", "scrum", "kanban", "jira", "confluence",
  ],
  ml_ai: [
    "machine learning", "deep learning", "neural networks", "tensorflow", "pytorch",
    "keras", "scikit-learn", "sklearn", "pandas", "numpy", "scipy", "matplotlib",
    "seaborn", "plotly", "opencv", "nlp", "natural language processing",
    "computer vision", "reinforcement learning", "transformers", "bert", "gpt",
    "llm", "hugging face", "langchain", "rag", "generative ai", "stable diffusion",
    "xgboost", "lightgbm", "catboost", "random forest", "svm", "regression",
    "classification", "clustering", "data science", "data analysis", "data engineering",
    "feature engineering", "model deployment", "mlops", "mlflow", "kubeflow",
    "airflow", "spark", "hadoop", "hive", "presto", "dbt",
  ],
  security: [
    "cybersecurity", "penetration testing", "ethical hacking", "owasp",
    "vulnerability assessment", "siem", "soc", "iam", "oauth", "jwt", "ssl",
    "tls", "encryption", "cryptography", "firewall", "ids", "ips",
    "zero trust", "sast", "dast", "devsecops", "compliance", "gdpr", "hipaa",
    "pci-dss", "iso 27001", "nist",
  ],
  mobile: [
    "ios", "android", "react native", "flutter", "xamarin", "ionic",
    "cordova", "swift", "kotlin", "objective-c", "java android",
    "mobile development", "xcode", "android studio", "firebase",
  ],
  soft_skills: [
    "leadership", "communication", "teamwork", "problem solving", "critical thinking",
    "time management", "adaptability", "creativity", "collaboration", "mentoring",
    "project management", "stakeholder management", "presentation", "negotiation",
    "customer service", "analytical thinking", "attention to detail", "multitasking",
  ],
  tools: [
    "git", "jira", "confluence", "slack", "figma", "adobe xd", "sketch",
    "postman", "insomnia", "swagger", "linux", "unix", "macos", "windows",
    "vim", "vscode", "intellij", "eclipse", "xcode", "android studio",
    "tableau", "power bi", "looker", "metabase", "excel", "google sheets",
  ],
};

// Flatten all skills into one searchable array with lowercase
const ALL_SKILLS = [...new Set(Object.values(SKILLS).flat().map((s) => s.toLowerCase()))];

// Build a quick lookup set
const SKILLS_SET = new Set(ALL_SKILLS);

module.exports = { SKILLS, ALL_SKILLS, SKILLS_SET };