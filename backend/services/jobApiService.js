const axios = require("axios");

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

/**
 * Fetch job description from Adzuna API
 */
async function fetchFromAdzuna(jobRole) {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY ||
      ADZUNA_APP_ID === "your_adzuna_app_id") {
    return null;
  }

  try {
    const encoded = encodeURIComponent(jobRole);
    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=3&what=${encoded}&content-type=application/json`;

    const response = await axios.get(url, { timeout: 8000 });
    const results = response.data?.results || [];

    if (results.length === 0) return null;

    // Combine top results for richer JD text
    const combinedText = results
      .map((r) => `${r.title || ""}\n${r.description || ""}`)
      .join("\n\n");

    return combinedText.trim() || null;
  } catch (err) {
    console.warn("Adzuna API error:", err.message);
    return null;
  }
}

/**
 * Mock JD generator based on job role keywords
 * Returns realistic job description text when API is unavailable
 */
function generateMockJD(jobRole) {
  const role = jobRole.toLowerCase();

  const jdTemplates = {
    "frontend developer": `
      Frontend Developer Job Description
      We are looking for a skilled Frontend Developer with expertise in React, TypeScript, and modern CSS frameworks.
      Requirements: JavaScript, TypeScript, React, Vue.js, HTML5, CSS3, Tailwind CSS, Redux, REST APIs, GraphQL,
      Git, Webpack, Vite, Jest, Cypress, responsive design, performance optimization, accessibility standards.
      Nice to have: Next.js, Storybook, Docker, CI/CD, Figma.
      Strong communication, teamwork, problem-solving, and attention to detail required.
    `,
    "backend developer": `
      Backend Developer Job Description
      Seeking an experienced Backend Developer to design and build scalable APIs and services.
      Requirements: Node.js, Python or Java, Express, FastAPI or Spring Boot, REST APIs, GraphQL,
      PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS or GCP, CI/CD, Git, Microservices architecture.
      Experience with message queues (Kafka, RabbitMQ), security best practices, OAuth, JWT.
      Strong problem-solving skills, teamwork and communication abilities.
    `,
    "full stack developer": `
      Full Stack Developer Job Description
      Looking for a Full Stack Developer proficient in both frontend and backend technologies.
      Requirements: JavaScript, TypeScript, React, Node.js, Express, Python, PostgreSQL, MongoDB,
      REST APIs, GraphQL, Docker, AWS, Git, CI/CD pipelines, HTML5, CSS3, Redux, Tailwind CSS.
      Experience with microservices, cloud deployment, performance optimization.
      Excellent communication, leadership, and collaboration skills.
    `,
    "data scientist": `
      Data Scientist Job Description
      We need a Data Scientist with strong analytical and ML expertise.
      Requirements: Python, R, Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-learn,
      Pandas, NumPy, SQL, Statistics, Data Analysis, Feature Engineering, Model Deployment,
      Data Visualization (Matplotlib, Seaborn, Plotly), NLP, Computer Vision, MLOps, MLflow.
      Experience with Spark, Hadoop, Airflow, cloud ML platforms (SageMaker, Vertex AI).
      Strong problem-solving and communication skills required.
    `,
    "devops engineer": `
      DevOps Engineer Job Description
      Seeking a DevOps Engineer to streamline our development and deployment processes.
      Requirements: Docker, Kubernetes, CI/CD, Jenkins, GitHub Actions, GitLab CI, Terraform,
      Ansible, AWS or Azure or GCP, Linux, Bash scripting, Python, Prometheus, Grafana,
      ELK Stack, Nginx, Security best practices, Git, Helm, ArgoCD.
      Experience with SRE practices, monitoring, and incident response.
      Teamwork, problem-solving, and communication skills are essential.
    `,
    "machine learning engineer": `
      Machine Learning Engineer Job Description
      We are hiring an ML Engineer to build and deploy production ML systems.
      Requirements: Python, TensorFlow, PyTorch, Scikit-learn, Machine Learning, Deep Learning,
      NLP, Computer Vision, MLOps, Docker, Kubernetes, AWS SageMaker or GCP Vertex AI,
      SQL, Pandas, NumPy, Git, REST APIs, Feature Engineering, Model Deployment, MLflow.
      Strong mathematics, statistics, and programming fundamentals required.
      Collaboration, communication and problem-solving skills needed.
    `,
    "software engineer": `
      Software Engineer Job Description
      Looking for a Software Engineer to build reliable, scalable software systems.
      Requirements: JavaScript or Python or Java or Go, Data Structures, Algorithms, REST APIs,
      SQL, Git, Docker, CI/CD, Agile, Scrum, Problem Solving, System Design,
      Microservices, Cloud (AWS or Azure or GCP), Testing (unit, integration), Code Review.
      Good communication, teamwork, and mentoring abilities are important.
    `,
    "ios developer": `
      iOS Developer Job Description
      Looking for an experienced iOS Developer to build world-class mobile apps.
      Requirements: Swift, Objective-C, iOS SDK, Xcode, UIKit, SwiftUI, Core Data,
      REST APIs, JSON, Git, App Store deployment, Auto Layout, Firebase,
      Push Notifications, Unit Testing, Instruments, Combine framework.
      Experience with React Native or Flutter is a plus. Strong problem-solving skills required.
    `,
    "android developer": `
      Android Developer Job Description
      Seeking an Android Developer to design and build advanced Android applications.
      Requirements: Kotlin, Java, Android SDK, Android Studio, Jetpack Compose, MVVM,
      Room Database, Retrofit, REST APIs, Git, Firebase, Google Play deployment,
      Material Design, Unit Testing, Coroutines, Dependency Injection (Hilt/Dagger).
      Strong analytical and debugging skills needed.
    `,
  };

  // Find best matching template
  for (const [key, template] of Object.entries(jdTemplates)) {
    if (role.includes(key) || key.includes(role)) {
      return template;
    }
  }

  // Partial keyword matching
  const keywords = {
    "react": jdTemplates["frontend developer"],
    "angular": jdTemplates["frontend developer"],
    "vue": jdTemplates["frontend developer"],
    "node": jdTemplates["backend developer"],
    "django": jdTemplates["backend developer"],
    "python": jdTemplates["data scientist"],
    "ml": jdTemplates["machine learning engineer"],
    "ai": jdTemplates["machine learning engineer"],
    "data": jdTemplates["data scientist"],
    "cloud": jdTemplates["devops engineer"],
    "kubernetes": jdTemplates["devops engineer"],
    "docker": jdTemplates["devops engineer"],
    "swift": jdTemplates["ios developer"],
    "kotlin": jdTemplates["android developer"],
    "android": jdTemplates["android developer"],
    "ios": jdTemplates["ios developer"],
  };

  for (const [keyword, template] of Object.entries(keywords)) {
    if (role.includes(keyword)) {
      return template;
    }
  }

  // Generic fallback
  return `
    ${jobRole} Job Description
    We are seeking a skilled ${jobRole} to join our growing team.
    Requirements: Strong programming skills, problem-solving ability, teamwork and communication.
    Experience with modern tools and technologies relevant to ${jobRole} role.
    Proficiency in JavaScript, Python, or similar languages. Experience with databases (SQL, MongoDB).
    Knowledge of REST APIs, Git, Docker, CI/CD pipelines, and cloud platforms (AWS, GCP, Azure).
    Agile methodology experience. Strong analytical skills. Excellent written and verbal communication.
    Ability to work in a fast-paced environment and deliver high-quality solutions.
    Leadership and mentoring experience is a plus.
  `;
}

/**
 * Main function: fetch JD for a job role
 * Tries Adzuna first, falls back to mock
 */
async function fetchJobDescription(jobRole) {
  if (!jobRole || typeof jobRole !== "string" || jobRole.trim().length === 0) {
    throw new Error("Invalid job role provided.");
  }

  const clean = jobRole.trim();

  // Try Adzuna API
  const apiResult = await fetchFromAdzuna(clean);
  if (apiResult && apiResult.length > 100) {
    console.log(` Fetched JD from Adzuna for: ${clean}`);
    return { text: apiResult, source: "adzuna" };
  }

  // Fall back to mock
  console.log(` Using mock JD for: ${clean}`);
  const mockJD = generateMockJD(clean);
  return { text: mockJD, source: "mock" };
}

module.exports = { fetchJobDescription };