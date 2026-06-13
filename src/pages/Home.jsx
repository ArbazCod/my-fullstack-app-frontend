import { Link } from "react-router-dom";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="container-main section-main">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">

          <img
  src="/images/MyOwn.jpeg"
  alt="Rohit"
  className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg object-cover"
/>

            <h1 className="mt-4 heading-main">
              Arbaz Khan
            </h1>

            <p className="text-blue-600 font-medium mt-2 text-main">
            Full Stack Developer | AI & ML Developer
            </p>

            <p className="text-gray-600 mt-2 text-sm md:text-base">
              B.Tech in Mechanical Engineering
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-5 text-2xl text-gray-700">

              <a
                href="https://github.com/ArbazCod"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="hover:text-black transition" />
              </a>

              <a
                href="https://www.linkedin.com/in/arbaz17"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin className="hover:text-blue-600 transition" />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=rohitcod50@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaEnvelope className="hover:text-red-600 transition" />
              </a>

              <a href="/Arbaz_Khan_Resume.pdf" download>
                <FaFileDownload className="hover:text-green-600 transition" />
              </a>
            </div>

          </div>

          {/* RIGHT */}
          <div>

            <h2 className="text-2xl md:text-4xl font-semibold mb-4">
              About Me
            </h2>

              <div className="max-w-5xl text-gray-700 text-lg leading-8">
              <p className="text-justify break-normal">
  Full Stack Developer and Mechanical Engineering graduate specializing in
  scalable, high-performance web applications and data-driven solutions.
  Focused on building secure, responsive, and user-centric products with
  a strong command of software engineering principles and system design.

  Proficient in the MERN stack, RESTful API development, authentication,
  database design, and cloud deployment. Actively working at the
  intersection of web development and AI — applying Machine Learning,
  Data Analytics, and Python across projects involving SQL, Pandas,
  Streamlit, predictive modeling, and intelligent automation.
</p>
</div>
            {/* BUTTONS */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">

              <Link to="/blog">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
                  Read Blogs
                </button>
              </Link>

              <Link to="/contact">
                <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 transition w-full sm:w-auto">
                  Contact Me
                </button>
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* PROJECTS SECTION */}
      <section className="bg-white section-main">

        <div className="container-main">

          <h2 className="text-2xl md:text-4xl font-bold text-center">
            Featured Projects
          </h2>

          <div className="grid-main mt-10">

            {/* PROJECT 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">

              <h3 className="font-semibold text-xl">
                ShopHub E-Commerce
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                MERN | JWT Auth | Razorpay | Admin Dashboard
              </p>

              <p className="text-sm text-green-600 mt-3">
                ✔ Completed
              </p>

              <Link
                to="/projects"
                className="text-blue-600 text-sm mt-4 inline-block hover:underline"
              >
                View Project →
              </Link>

            </div>

            {/* PROJECT 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">

              <h3 className="font-semibold text-xl">
                InsightBank Analytics
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Python | SQL | Streamlit | Plotly | ML
              </p>

              <p className="text-sm text-green-600 mt-3">
                ✔ Completed
              </p>

              <Link
                to="/projects"
                className="text-blue-600 text-sm mt-4 inline-block hover:underline"
              >
                View Project →
              </Link>

            </div>

            {/* PROJECT 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">

              <h3 className="font-semibold text-xl">
                SmartCart Segmentation
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                K-Means | PCA | Streamlit | Machine Learning
              </p>

              <p className="text-sm text-green-600 mt-3">
                ✔ Completed
              </p>

              <Link
                to="/projects"
                className="text-blue-600 text-sm mt-4 inline-block hover:underline"
              >
                View Project →
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* SKILLS SECTION */}
      <section className="section-main">

        <div className="container-main text-center">

          <h2 className="text-2xl md:text-4xl font-bold">
            Technical Skills
          </h2>

          <div className="w-20 h-1 bg-blue-600 mx-auto mt-3 mb-8 rounded-full"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Frontend */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Frontend</h3>
                <span className="text-2xl">⚛️</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {["React", "JavaScript"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Backend</h3>
                <span className="text-2xl">🖥️</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Node.js", "Express", "MongoDB", "REST APIs"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI & ML */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">AI & ML</h3>
                <span className="text-2xl">🤖</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "Pandas",
                  "NumPy",
                  "Machine Learning",
                  "Deep Learning",
                  "Supervised Learning",
                  "Unsupervised Learning",
                  "Streamlit",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Tools</h3>
                <span className="text-2xl">🛠️</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {["SQL", "Git & GitHub", "VS Code"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* STATS SECTION */}
      <section className="bg-blue-600 text-white section-main">

        <div className="container-main">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <h3 className="text-3xl md:text-4xl font-bold">
                2
              </h3>
              <p className="mt-2 text-sm md:text-base">
                Full-Stack Projects
              </p>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold">
                3
              </h3>
              <p className="mt-2 text-sm md:text-base">
                AI & ML Projects
              </p>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold">
                2+
              </h3>
              <p className="mt-2 text-sm md:text-base">
                Years Learning
              </p>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold">
                MERN
              </h3>
              <p className="mt-2 text-sm md:text-base">
                Stack Developer
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA SECTION */}
      <section className="section-main text-center">

        <div className="container-main">

          <h2 className="text-2xl md:text-4xl font-semibold">
            Open to Jobs, Internships & Freelance Work
          </h2>

          <p className="text-gray-600 mt-4 text-main">
            Let's build something impactful together.
          </p>

          <Link to="/contact">

            <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition">
              Contact Me
            </button>

          </Link>

        </div>

      </section>

    </div>
  );
}




  