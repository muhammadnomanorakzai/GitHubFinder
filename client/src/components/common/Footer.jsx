import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="relative mt-10 border-t border-white/10 bg-slate-950/70 px-6 pb-8 pt-12 text-slate-300 backdrop-blur-xl lg:px-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:pr-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/20 to-indigo-500/20">
              <img
                src="/GitHubFinderLogo.png"
                alt="GitHub Finder Logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <div>
              <span className="premium-title text-2xl font-bold tracking-tight">
                GitHub Finder
              </span>
              <p className="text-xs uppercase tracking-[0.26em] text-sky-300/70">
                Search smarter
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Search GitHub users, inspect developer profiles, and explore repositories
            through a fast, polished experience designed for modern workflows.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link to="/" className="hover:text-sky-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-sky-300">
                About
              </Link>
            </li>
            <li>
              <HashLink smooth to="/#faq" className="hover:text-sky-300">
                FAQ
              </HashLink>
            </li>
            <li>
              <HashLink smooth to="/#contact" className="hover:text-sky-300">
                Contact
              </HashLink>
            </li>
            <li>
              <HashLink smooth to="/#testimonials" className="hover:text-sky-300">
                Feedback
              </HashLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Platform</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <span className="hover:text-sky-300">Profile discovery</span>
            </li>
            <li>
              <span className="hover:text-sky-300">Repository exploration</span>
            </li>
            <li>
              <span className="hover:text-sky-300">Developer research</span>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-300"
              >
                Visit GitHub
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">About Project</h4>
          <div className="glass-panel p-5">
            <p className="text-sm leading-7 text-slate-400">
              GitHub Finder is an open-source React app built to help developers
              discover talent, inspect activity, and move from search to insight
              without friction.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>(c) {new Date().getFullYear()} GitHub Finder. All rights reserved.</p>
        <p className="text-slate-500">Built for developers who value speed, clarity, and craft.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
