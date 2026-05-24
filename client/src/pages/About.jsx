import { motion } from "framer-motion";
import {
  FaGithub,
  FaSearch,
  FaStar,
  FaUsers,
  FaCodeBranch,
  FaBullseye,
  FaLightbulb,
  FaLinkedin,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const FEATURES = [
  {
    icon: <FaSearch />,
    title: "Smart Search",
    desc: "Find GitHub users and repositories instantly with a focused search experience and better filtering.",
  },
  {
    icon: <FaUsers />,
    title: "Profile Insights",
    desc: "View essential GitHub profile details, followers, and repository context in one place.",
  },
  {
    icon: <FaStar />,
    title: "Top Repositories",
    desc: "Surface notable repositories quickly so you can evaluate work without extra clicks.",
  },
  {
    icon: <FaCodeBranch />,
    title: "Developer Stats",
    desc: "Scan repos, followers, and profile strength with a cleaner information hierarchy.",
  },
];

const TEAM = [
  {
    name: "Muhammad Osama",
    role: "Project Creator (React)",
    github: "https://github.com/xamQrexii",
    linkedin: "https://www.linkedin.com/in/xamqrexii/",
    avatar: "/Muhammad-Osama.png",
  },
  {
    name: "Engr Muhammad Noman",
    role: "Lead Developer (Vite + Advanced Features + Backend)",
    github: "https://github.com/muhammadnomanorakzai",
    linkedin: "https://www.linkedin.com/in/muhammad-noman-7a3156339/",
    avatar: "/Noman.png",
  },
];

export default function About() {
  return (
    <div id="about" className="pb-8">
      <section className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="section-shell">
          <div className="section-card relative overflow-hidden">
            <img
              src="/about-bg.avif"
              alt="GitHub Finder Background"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_28%),linear-gradient(135deg,rgba(2,6,23,0.78),rgba(15,23,42,0.88),rgba(17,24,39,0.96))]" />

            <motion.div
              className="relative z-10 mx-auto flex min-h-[68vh] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center sm:px-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}>
              <span className="section-kicker">About GitHub Finder</span>
              <h1 className="premium-title mt-6 text-balance text-5xl font-extrabold sm:text-6xl lg:text-7xl">
                Built to make GitHub exploration feel fast and effortless
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                A modern tool for developers and students to search, explore,
                and analyze GitHub users and repositories from one polished
                dashboard.
              </p>
              <a href="/" className="btn-primary mt-8">
                Explore GitHub Now
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              className="glass-panel p-6 sm:p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}>
              <FaLightbulb className="mb-5 text-4xl text-sky-300" />
              <h2 className="text-3xl font-bold text-white">Vision</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                To empower developers worldwide with a fast, intuitive tool that
                makes GitHub exploration effortless and insightful.
              </p>
            </motion.div>

            <motion.div
              className="glass-panel p-6 sm:p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}>
              <FaBullseye className="mb-5 text-4xl text-indigo-300" />
              <h2 className="text-3xl font-bold text-white">Mission</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                To simplify collaboration, discovery, and growth by integrating
                powerful search, analysis, and repository insights in one
                platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-shell">
          <div className="section-card p-6 sm:p-8 lg:p-10">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="section-kicker">Core Features</span>
              <h2 className="premium-title mt-5 text-4xl font-extrabold sm:text-5xl">
                Built for a cleaner developer workflow
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {FEATURES.map(({ icon, title, desc }) => (
                <motion.div
                  key={title}
                  className="glass-panel p-6 text-left"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-2xl text-sky-300">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-shell">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="section-kicker">Team</span>
            <h2 className="premium-title mt-5 text-4xl font-extrabold sm:text-5xl">
              Meet the developers behind the project
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {TEAM.map(({ name, role, github, linkedin, avatar }) => (
              <motion.div
                key={name}
                className="glass-panel flex flex-col items-center rounded-[28px] px-6 py-8 text-center"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}>
                <img
                  src={avatar}
                  alt={name}
                  className="h-24 w-24 rounded-[2rem] border border-white/10 object-cover shadow-[0_16px_40px_rgba(15,23,42,0.35)]"
                />
                <h3 className="mt-5 text-2xl font-semibold text-white">
                  {name}
                </h3>
                <p className="mt-2 text-sm font-medium text-sky-300">{role}</p>
                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
                  {name === "Muhammad Osama"
                    ? "Started the GitHub Finder project in React, simplifying GitHub exploration for developers."
                    : "Enhanced the project with Vite, advanced features, Backend Integration and a more refined developer experience."}
                </p>

                <div className="mt-6 flex gap-4">
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-slate-300 hover:border-sky-400/25 hover:text-white">
                    <FaGithub />
                  </a>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-slate-300 hover:border-sky-400/25 hover:text-sky-300">
                    <FaLinkedin />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
