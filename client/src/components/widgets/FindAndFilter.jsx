import { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaArrowRight,
  FaFilter,
  FaGithub,
  FaTimes,
  FaCodeBranch,
  FaStar,
} from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GitHubProfileModal from "./GitHubProfileModal";

const FILTER_FIELDS = [
  { label: "By Username", key: "username", type: "user" },
  { label: "By Display Name", key: "name", type: "user" },
  { label: "By Repo", key: "repo", type: "repo" },
  { label: "By Language", key: "language", type: "repo" },
  { label: "By Location", key: "location", type: "user" },
];

const ITEMS_PER_PAGE = 8;
const SUGGESTIONS_DEBOUNCE_MS = 450;

export default function FindAndFilter() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeUsername, setActiveUsername] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(new Set(["username", "name"]));
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionsRequestRef = useRef(0);

  const toggleFilter = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const computeMatchPercent = (item) => {
    const selCount = selected.size || 1;
    const matchedCount = item.matchedBy?.length || 0;
    return Math.round((matchedCount / selCount) * 100);
  };

  const handleSearch = async (forcedQuery = query) => {
    const q = forcedQuery.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setSuggestionsOpen(false);
    setLoading(true);
    setResults([]);
    setCurrentPage(1);

    try {
      const sel = Array.from(selected);
      const userFilters = sel.filter((k) =>
        FILTER_FIELDS.find((f) => f.key === k && f.type === "user")
      );
      const repoFilters = sel.filter((k) =>
        FILTER_FIELDS.find((f) => f.key === k && f.type === "repo")
      );

      const fetched = [];

      if (userFilters.length > 0) {
        const inParts = [];
        const qualifiers = [];
        if (userFilters.includes("username")) inParts.push("login");
        if (userFilters.includes("name")) inParts.push("name");
        if (userFilters.includes("bio")) inParts.push("bio");
        if (userFilters.includes("location")) qualifiers.push(`location:${q}`);
        if (userFilters.includes("company")) qualifiers.push(`company:${q}`);

        let userQ = encodeURIComponent(q);
        if (inParts.length > 0) {
          userQ = encodeURIComponent(`${q} in:${inParts.join(",")}`);
        }
        if (qualifiers.length > 0) {
          userQ += "+" + qualifiers.map((s) => encodeURIComponent(s)).join("+");
        }

        const usersUrl = `https://api.github.com/search/users?q=${userQ}&per_page=50`;
        const res = await fetch(usersUrl);
        const data = await res.json();
        if (data?.items?.length) {
          fetched.push(
            ...data.items.map((u) => ({
              type: "user",
              id: u.id,
              login: u.login,
              avatar_url: u.avatar_url,
              html_url: u.html_url,
              matchedBy: userFilters.map(
                (k) => FILTER_FIELDS.find((f) => f.key === k)?.label || k
              ),
              raw: u,
            }))
          );
        }
      }

      if (repoFilters.length > 0) {
        const inParts = [];
        const qualifiers = [];
        if (repoFilters.includes("repo")) inParts.push("name");
        if (repoFilters.includes("description")) inParts.push("description");
        if (repoFilters.includes("language")) qualifiers.push(`language:${q}`);

        let repoQ = encodeURIComponent(q);
        if (inParts.length > 0) {
          repoQ = encodeURIComponent(`${q} in:${inParts.join(",")}`);
        }
        if (qualifiers.length > 0) {
          repoQ += "+" + qualifiers.map((s) => encodeURIComponent(s)).join("+");
        }

        const reposUrl = `https://api.github.com/search/repositories?q=${repoQ}&per_page=50`;
        const resR = await fetch(reposUrl);
        const dataR = await resR.json();
        if (dataR?.items?.length) {
          fetched.push(
            ...dataR.items.map((r) => ({
              type: "repo",
              id: r.id,
              full_name: r.full_name,
              name: r.name,
              owner: r.owner,
              avatar_url: r.owner?.avatar_url,
              html_url: r.html_url,
              description: r.description,
              language: r.language,
              stargazers_count: r.stargazers_count,
              matchedBy: repoFilters.map(
                (k) => FILTER_FIELDS.find((f) => f.key === k)?.label || k
              ),
              raw: r,
            }))
          );
        }
      }

      if (userFilters.length === 0 && repoFilters.length === 0) {
        const usersUrl = `https://api.github.com/search/users?q=${encodeURIComponent(
          `${q} in:login,in:name,in:bio`
        )}&per_page=40`;
        const [resU, resR] = await Promise.all([
          fetch(usersUrl),
          fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(
              `${q} in:name,in:description`
            )}&per_page=40`
          ),
        ]);
        const dataU = await resU.json();
        const dataR = await resR.json();
        if (dataU?.items) {
          fetched.push(
            ...dataU.items.map((u) => ({
              type: "user",
              id: u.id,
              login: u.login,
              avatar_url: u.avatar_url,
              html_url: u.html_url,
              matchedBy: ["All fields"],
              raw: u,
            }))
          );
        }
        if (dataR?.items) {
          fetched.push(
            ...dataR.items.map((r) => ({
              type: "repo",
              id: r.id,
              full_name: r.full_name,
              name: r.name,
              owner: r.owner,
              avatar_url: r.owner?.avatar_url,
              html_url: r.html_url,
              description: r.description,
              language: r.language,
              stargazers_count: r.stargazers_count,
              matchedBy: ["All fields"],
              raw: r,
            }))
          );
        }
      }

      const map = new Map();
      for (const it of fetched) {
        const key = `${it.type}-${it.id}`;
        if (!map.has(key)) {
          map.set(key, it);
        } else {
          const prev = map.get(key);
          prev.matchedBy = Array.from(
            new Set([...(prev.matchedBy || []), ...(it.matchedBy || [])])
          );
          map.set(key, prev);
        }
      }

      const merged = Array.from(map.values());
      merged.sort((a, b) =>
        a.type === b.type ? 0 : a.type === "user" ? -1 : 1
      );
      setResults(merged);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trimmedQuery = query.trim();
    const shouldFetchSuggestions =
      trimmedQuery.length >= 2 &&
      !loading &&
      (selected.has("username") || selected.has("name"));

    if (!shouldFetchSuggestions) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      setSuggestionsLoading(false);
      return undefined;
    }

    const currentRequestId = suggestionsRequestRef.current + 1;
    suggestionsRequestRef.current = currentRequestId;

    const timeoutId = window.setTimeout(async () => {
      setSuggestionsLoading(true);

      try {
        const suggestionsUrl = `https://api.github.com/search/users?q=${encodeURIComponent(
          `${trimmedQuery} in:login`
        )}&per_page=6`;
        const response = await fetch(suggestionsUrl);
        const data = await response.json();

        if (suggestionsRequestRef.current !== currentRequestId) {
          return;
        }

        const nextSuggestions =
          data?.items?.map((item) => ({
            id: item.id,
            login: item.login,
            avatar_url: item.avatar_url,
          })) || [];

        setSuggestions(nextSuggestions);
        setSuggestionsOpen(nextSuggestions.length > 0);
      } catch (error) {
        if (suggestionsRequestRef.current === currentRequestId) {
          console.error("Suggestion search error:", error);
          setSuggestions([]);
          setSuggestionsOpen(false);
        }
      } finally {
        if (suggestionsRequestRef.current === currentRequestId) {
          setSuggestionsLoading(false);
        }
      }
    }, SUGGESTIONS_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loading, query, selected]);

  const handleSuggestionSelect = (suggestedUsername) => {
    setQuery(suggestedUsername);
    setSuggestionsOpen(false);
    setSuggestions([]);
    handleSearch(suggestedUsername);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSuggestions([]);
    setSuggestionsOpen(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE) || 1;
  const paginated = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const parentVars = { show: { transition: { staggerChildren: 0.05 } } };
  const cardVars = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <>
      <section className="page-section pt-12 sm:pt-16" id="githubFinder">
        <div className="section-shell">
          <div className="section-card overflow-visible p-5 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_50%)]" />

            <div className="relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <span className="section-kicker">
                  <Sparkles className="text-[0.65rem]" />
                  GitHub Discovery
                </span>
                <h2 className="premium-title mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Find GitHub profiles and repositories with precision
                </h2>
                <p className="section-subtitle mx-auto text-balance">
                  Search across usernames, display names, repositories,
                  languages, and locations with a cleaner workflow built for
                  modern developer research.
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-5xl">
                <div className="glass-panel relative z-20 overflow-visible p-4 sm:p-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row">
                      <div className="relative flex-1">
                        <FaSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          ref={searchInputRef}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onFocus={() => {
                            if (suggestions.length > 0) {
                              setSuggestionsOpen(true);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSearch();
                            }
                            if (e.key === "Escape") {
                              setSuggestionsOpen(false);
                            }
                          }}
                          placeholder="Search GitHub users or repositories..."
                          className="input-premium min-h-[3.7rem] border-gray-700 bg-[#111827] pl-14 pr-16 text-sm text-gray-100 caret-cyan-400 placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 sm:text-base"
                        />

                        <AnimatePresence>
                          {(suggestionsOpen || suggestionsLoading) && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              className="absolute left-0 right-0 top-[calc(100%+12px)] z-40 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-[0_24px_60px_rgba(2,6,23,0.7)] backdrop-blur-2xl"
                            >
                              {suggestionsLoading ? (
                                <div className="px-5 py-4 text-sm text-slate-400">
                                  Searching usernames...
                                </div>
                              ) : suggestions.length > 0 ? (
                                <ul className="py-2">
                                  {suggestions.map((suggestion) => (
                                    <li key={suggestion.id}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSuggestionSelect(suggestion.login)
                                        }
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.06]"
                                      >
                                        <img
                                          src={suggestion.avatar_url}
                                          alt={suggestion.login}
                                          className="h-10 w-10 rounded-2xl border border-white/10 object-cover"
                                        />
                                        <div className="min-w-0">
                                          <p className="truncate text-sm font-semibold text-white">
                                            {suggestion.login}
                                          </p>
                                          <p className="text-xs text-slate-400">
                                            Click to search this username
                                          </p>
                                        </div>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <button
                            onClick={() => setFilterOpen((o) => !o)}
                            className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-medium ${
                              filterOpen
                                ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                            }`}
                            aria-expanded={filterOpen}
                            aria-label="Toggle search filters"
                          >
                            <FaFilter className="text-xs" />
                            <span className="hidden sm:inline">Filters</span>
                          </button>

                          <AnimatePresence>
                            {filterOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                className="absolute right-0 z-50 mt-3 w-72 rounded-3xl border border-white/10 bg-slate-950/95 p-5 shadow-[0_24px_60px_rgba(2,6,23,0.7)] backdrop-blur-2xl"
                              >
                                <p className="mb-4 text-sm font-semibold text-white">
                                  Search in
                                </p>
                                <ul className="space-y-3">
                                  {FILTER_FIELDS.map((f) => (
                                    <li
                                      key={f.key}
                                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2"
                                    >
                                      <label
                                        htmlFor={`check-${f.key}`}
                                        className="flex cursor-pointer items-center gap-3 text-sm text-slate-300"
                                      >
                                        <input
                                          id={`check-${f.key}`}
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-sky-400 focus:ring-sky-400/40"
                                          checked={selected.has(f.key)}
                                          onChange={() => toggleFilter(f.key)}
                                        />
                                        <span>{f.label}</span>
                                      </label>
                                      <span className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
                                        {f.type}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="flex gap-3 sm:justify-end">
                        <button
                          onClick={() => handleSearch()}
                          className="btn-primary flex-1 sm:flex-none"
                        >
                          <FaSearch className="text-xs" />
                          Search
                        </button>
                        <button
                          onClick={handleClear}
                          className="btn-secondary flex-1 sm:flex-none"
                        >
                          <FaTimes className="text-xs" />
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(selected).map((k) => {
                          const f = FILTER_FIELDS.find((ff) => ff.key === k);
                          return (
                            <span key={k} className="chip">
                              <Sparkles className="text-[0.6rem] text-sky-300" />
                              {f?.label || k}
                            </span>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-slate-400 sm:text-sm">
                        <span className="chip">
                          <FaGithub className="text-sky-300" />
                          User + repo search
                        </span>
                        <span className="chip">
                          <FaCodeBranch className="text-indigo-300" />
                          Filtered matching
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                {loading ? (
                  <div className="glass-panel mx-auto max-w-3xl p-8 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-sky-400/20 border-t-sky-300" />
                    <h3 className="text-lg font-semibold text-white">
                      Searching GitHub
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Pulling the best matching users and repositories for your
                      query.
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="glass-panel mx-auto flex max-w-3xl flex-col items-center p-8 text-center sm:p-10">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-400/10">
                      <FaGithub className="text-3xl text-sky-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {query.trim().length < 2
                        ? "Start with a search"
                        : "No matching results"}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                      {query.trim().length < 2
                        ? "Enter at least two characters and choose the fields you want to search across."
                        : "Try a broader keyword, switch filters, or search by username, repository name, language, or location."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                          Search Results
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                          {results.length} matches found
                        </h3>
                      </div>
                      <p className="text-sm text-slate-400">
                        Page {currentPage} of {totalPages}
                      </p>
                    </div>

                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={currentPage}
                        variants={parentVars}
                        initial="hidden"
                        animate="show"
                        layout
                        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
                      >
                        {paginated.map((item) => {
                          const isRepo = item.type === "repo";
                          const matchPercent = computeMatchPercent(item);

                          return (
                            <motion.div
                              key={`${item.type}-${item.id}`}
                              variants={cardVars}
                              whileHover={{ y: -5 }}
                              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/75 shadow-[0_18px_45px_rgba(2,6,23,0.4)] backdrop-blur-xl"
                              onClick={() =>
                                isRepo
                                  ? window.open(item.html_url, "_blank")
                                  : setActiveUsername(item.login)
                              }
                            >
                              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-sky-400/10 via-transparent to-indigo-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />

                              <div className="relative h-44 w-full overflow-hidden border-b border-white/10">
                                <div
                                  className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-xl"
                                  style={{
                                    backgroundImage: `url(${item.avatar_url})`,
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-950/20 to-slate-950/85" />

                                <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                                  <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-200">
                                    {isRepo ? "Repository" : "User"}
                                  </span>
                                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                                    {matchPercent}% match
                                  </span>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-5">
                                  <div className="min-w-0">
                                    <h4 className="truncate text-lg font-bold text-white">
                                      {isRepo ? item.full_name : item.login}
                                    </h4>
                                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                                      {(item.matchedBy || []).slice(0, 2).join(" / ")}
                                    </p>
                                  </div>

                                  <img
                                    src={item.avatar_url}
                                    alt={isRepo ? item.full_name : item.login}
                                    className="h-16 w-16 rounded-2xl border border-white/20 object-cover shadow-[0_12px_30px_rgba(15,23,42,0.45)]"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-1 flex-col p-5">
                                {isRepo ? (
                                  <>
                                    <p className="min-h-[4.5rem] overflow-hidden text-sm leading-6 text-slate-400 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                                      {item.description ||
                                        "No repository description provided."}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                                      <span className="chip border-white/5 bg-white/[0.03]">
                                        {item.language || "Unknown language"}
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <FaStar className="text-amber-300" />
                                        {item.stargazers_count ?? 0}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm leading-6 text-slate-400">
                                      Explore this profile to view followers,
                                      repositories, and more GitHub details.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {(item.matchedBy || []).slice(0, 3).map((m, idx) => (
                                        <span
                                          key={idx}
                                          className="chip border-white/5 bg-white/[0.03]"
                                        >
                                          {m}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                )}

                                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                                  {isRepo ? "Visit repository" : "Open profile"}
                                  <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>

                    {totalPages > 1 && (
                      <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`inline-flex min-w-[42px] items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold ${
                              currentPage === i + 1
                                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950 shadow-[0_16px_34px_rgba(56,189,248,0.22)]"
                                : "border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/20 hover:text-white"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GitHubProfileModal
        open={!!activeUsername}
        onClose={() => setActiveUsername(null)}
        username={activeUsername}
      />
    </>
  );
}
