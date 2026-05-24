import { motion } from "framer-motion";
import { FaGithub, FaSearch } from "react-icons/fa";

export default function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] grid place-items-center bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_28%),linear-gradient(180deg,#020617_0%,#0b1120_48%,#111827_100%)]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          className="relative flex h-32 w-32 items-center justify-center rounded-full border border-sky-300/20 bg-white/5 shadow-[0_0_45px_rgba(56,189,248,0.16)] backdrop-blur-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-3 rounded-full border border-indigo-400/20"
            animate={{ rotate: -360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { duration: 2.2, repeat: Infinity } }}
          />
          <motion.div
            className="relative flex items-center justify-center text-slate-50"
            animate={{ scale: [0.96, 1.08, 0.96] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaGithub className="text-5xl drop-shadow-[0_8px_18px_rgba(15,23,42,0.55)]" />
            <FaSearch className="absolute -bottom-1 -right-3 text-xl text-cyan-300" />
          </motion.div>
        </motion.div>

        <div className="text-center">
          <p className="premium-title text-xl font-bold tracking-tight">Loading GitHub Finder</p>
          <p className="mt-2 text-sm text-slate-400">
            Preparing a faster way to explore developers and repositories.
          </p>
        </div>

        <motion.div
          className="h-1.5 w-28 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400"
          animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.75, 1.15, 0.75] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
