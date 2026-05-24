import { useState, useRef, useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";

const FAQ_DATA = [
  {
    q: "What is GitHub Finder?",
    a: "GitHub Finder is a tool to quickly search GitHub users and repositories. You can filter by username, repo name, language, or location to find exactly what you need.",
  },
  {
    q: "How do I search for users or repositories?",
    a: "Type your query in the search bar and select one or multiple filters. Press Enter or click Search to see the results in a responsive card layout.",
  },
  {
    q: "Can I search by multiple filters at once?",
    a: "Yes! You can select multiple filters and the results will show matches according to your selection.",
  },
  {
    q: "How are search results displayed?",
    a: "Results are shown as cards. User cards display the avatar and username, while repo cards show repo name, owner avatar, description, and matched filter badges.",
  },
  {
    q: "What do the badges on each card mean?",
    a: "Badges indicate which filters matched your query, so you can quickly see why a result appeared.",
  },
  {
    q: "Can I open a repository or user profile from the results?",
    a: "Yes. Clicking a repository card opens the GitHub repo in a new tab, and clicking a user card opens a detailed modal with profile information.",
  },
  {
    q: "How does pagination work?",
    a: "Results are split into pages with a fixed number of items per page. Use the page buttons below the grid to move through larger result sets.",
  },
  {
    q: "What happens if no results are found?",
    a: "A friendly empty state appears when there are no matches. Try adjusting your query or the selected filters.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section id="faq" className="page-section">
      <div className="section-shell">
        <div className="section-card p-6 sm:p-8 lg:p-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="section-kicker">FAQ</span>
            <h2 className="premium-title mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Answers to the most common questions
            </h2>
            <p className="section-subtitle mx-auto">
              Everything you need to know about searching users, exploring
              repositories, and using the GitHub Finder workflow efficiently.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            {FAQ_DATA.map(({ q, a }, idx) => {
              const open = openId === idx;
              return (
                <FAQItem
                  key={idx}
                  question={q}
                  answer={a}
                  open={open}
                  onToggle={() => toggle(idx)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, open, onToggle }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [answer]);

  return (
    <div className="mb-4 rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(2,6,23,0.24)] backdrop-blur-xl transition duration-300 hover:border-sky-400/20">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span className="text-base font-semibold text-slate-100 sm:text-lg">
          {question}
        </span>
        <BiChevronRight
          className={`shrink-0 text-2xl text-slate-400 transition-transform duration-300 ${
            open ? "rotate-90 text-sky-300" : ""
          }`}
        />
      </button>

      <div
        className="overflow-hidden px-5 transition-[max-height] duration-300 ease-in-out sm:px-6"
        style={{ maxHeight: open ? height : 0 }}
      >
        <p ref={ref} className="pb-5 text-sm leading-7 text-slate-400 sm:text-base">
          {answer}
        </p>
      </div>
    </div>
  );
}
