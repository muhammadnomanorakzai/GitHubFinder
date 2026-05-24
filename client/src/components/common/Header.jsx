import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { BiMenu, BiX } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";

const BAR_H = 40;

const NAV_LINKS = [
  { label: "Home", path: "/", type: "route" },
  { label: "About", path: "/about", type: "route" },
  { label: "FAQ", path: "/#faq", type: "hash" },
  { label: "Contact", path: "/#contact", type: "hash" },
  { label: "Feedback", path: "/#testimonials", type: "hash" },
];

const SOCIAL_LINKS = [
  {
    icon: "bi-github",
    href: "https://github.com/muhammadnomanorakzai",
    label: "GitHub",
  },
  {
    icon: "bi-facebook",
    href: "https://www.facebook.com/nomii.khani.3",
    label: "Facebook",
  },
  {
    icon: "bi-instagram",
    href: "https://www.instagram.com/muhammadnomanorakzai1/",
    label: "Instagram",
  },
  {
    icon: "bi-linkedin",
    href: "https://www.linkedin.com/in/muhammad-noman-7a3156339/",
    label: "LinkedIn",
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > BAR_H);
    handle();
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const isActiveLink = (path, type) => {
    if (type === "hash") {
      return location.hash === path.replace("/#", "#");
    }
    if (path === "/") {
      return location.pathname === "/" && location.hash === "";
    }
    return location.pathname === path;
  };

  const linkClass = (isActive) =>
    `group relative inline-flex items-center text-sm font-medium tracking-wide transition duration-300 ${
      isActive ? "text-sky-200" : "text-slate-300 hover:text-white"
    }`;

  const renderNavLabel = (label, isActive) => (
    <span className="relative pb-2">
      {label}
      <span
        className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </span>
  );

  const barV = {
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } },
    hide: { y: "-100%", opacity: 0, transition: { duration: 0.35 } },
  };

  const navV = {
    show: { y: 0, transition: { duration: 0.4 } },
    shift: { y: -BAR_H, transition: { duration: 0.35 } },
  };

  const drawer = {
    hidden: { x: "100%", opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  return (
    <header className="sticky top-0 z-[997]">
      <motion.div
        variants={barV}
        animate={scrolled ? "hide" : "show"}
        className="border-b border-white/10 bg-slate-950/75 px-4 text-sm text-slate-200 backdrop-blur-xl">
        <div className="section-shell flex h-10 flex-wrap items-center justify-center gap-y-2 sm:justify-between">
          <span className="flex items-center gap-2 text-xs text-slate-300 sm:text-sm">
            <i className="bi bi-lightning-charge-fill text-sky-300" />
            <HashLink smooth to="/#contact" className="hover:text-white">
              Need help finding the right GitHub profile?
            </HashLink>
          </span>

          <span className="flex items-center gap-4 text-base text-slate-400">
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition hover:-translate-y-0.5 hover:text-sky-300">
                <i className={`bi ${icon}`} />
              </a>
            ))}
          </span>
        </div>
      </motion.div>

      <motion.div
        variants={navV}
        animate={scrolled ? "shift" : "show"}
        className="border-b border-white/10 bg-slate-950/70 shadow-[0_18px_40px_rgba(2,6,23,0.26)] backdrop-blur-2xl">
        <div className="section-shell flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/20 to-indigo-500/20 shadow-[0_10px_35px_rgba(56,189,248,0.18)]">
              <img
                src="/GitHubFinderLogo.png"
                alt="GitHub Finder"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-300/80">
                Developer Search
              </p>
              <h1 className="premium-title text-2xl font-bold tracking-tight sm:text-3xl">
                GitHub Finder
              </h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {NAV_LINKS.map(({ label, path, type }) =>
              type === "hash" ? (
                <HashLink
                  smooth
                  key={label}
                  to={path}
                  className={linkClass(isActiveLink(path, type))}>
                  {renderNavLabel(label, isActiveLink(path, type))}
                </HashLink>
              ) : (
                <NavLink
                  key={label}
                  to={path}
                  onClick={
                    label === "Home"
                      ? () => window.scrollTo({ top: 0, behavior: "smooth" })
                      : undefined
                  }
                  className={() => linkClass(isActiveLink(path, type))}>
                  {renderNavLabel(label, isActiveLink(path, type))}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/muhammadnomanorakzai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary hidden xl:inline-flex">
              <i className="bi bi-github text-base" />
              GitHub
            </a>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl text-slate-100 shadow-[0_12px_32px_rgba(15,23,42,0.22)] hover:border-sky-400/30 hover:text-sky-200 xl:hidden"
              aria-label="Open menu">
              <BiMenu />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9997] bg-slate-950/75 backdrop-blur-sm xl:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu overlay"
            />
            <motion.aside
              variants={drawer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed right-0 top-0 z-[9998] h-full w-[86%] max-w-sm border-l border-white/10 bg-slate-950/95 px-6 py-6 shadow-[0_20px_60px_rgba(2,6,23,0.7)] backdrop-blur-2xl xl:hidden">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">
                    Navigation
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    GitHub Finder
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl text-slate-200 hover:text-white"
                  aria-label="Close menu">
                  <BiX />
                </button>
              </div>

              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map(({ label, path, type }) => (
                  <li key={label}>
                    {type === "hash" ? (
                      <HashLink
                        smooth
                        to={path}
                        className={`flex rounded-2xl px-4 py-3 text-base font-medium ${
                          isActiveLink(path, type)
                            ? "bg-sky-400/10 text-sky-200"
                            : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white"
                        }`}>
                        {label}
                      </HashLink>
                    ) : (
                      <NavLink
                        to={path}
                        onClick={
                          label === "Home"
                            ? () =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            : undefined
                        }
                        className={() =>
                          `flex rounded-2xl px-4 py-3 text-base font-medium ${
                            isActiveLink(path, type)
                              ? "bg-sky-400/10 text-sky-200"
                              : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white"
                          }`
                        }>
                        {label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full">
                  <i className="bi bi-github text-base" />
                  Open GitHub
                </a>
                <div className="flex items-center justify-center gap-4 text-lg text-slate-400">
                  {SOCIAL_LINKS.map(({ icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="transition hover:text-sky-300">
                      <i className={`bi ${icon}`} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
