import { Fragment, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaArrowRightLong,
  FaGithub,
  FaLocationDot,
  FaBuilding,
  FaLink,
  FaTwitter,
  FaStar,
  FaCodeBranch,
  FaUserGroup,
} from "react-icons/fa6";
import GithubContext from "../../context/github/githubContext";

export default function GitHubProfileModal({
  open,
  onClose,
  username,
  matchScore = 0,
}) {
  const { user, repos, getUser, getUserRepos } = useContext(GithubContext);

  useEffect(() => {
    if (open && username) {
      getUser(username);
      getUserRepos(username);
    }
  }, [open, username]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !user || Object.keys(user).length === 0) return null;

  const {
    avatar_url,
    login,
    name,
    bio,
    company,
    blog,
    location,
    twitter_username,
    public_repos,
    followers,
    following,
    hireable,
    created_at,
    html_url,
  } = user;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-6"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-6"
            >
              <Dialog.Panel className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 shadow-[0_30px_90px_rgba(2,6,23,0.82)] backdrop-blur-2xl">
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-xl text-white hover:border-sky-400/30 hover:text-sky-200"
                  aria-label="Close profile modal"
                >
                  X
                </button>

                <div className="relative overflow-hidden border-b border-white/10 px-6 pb-8 pt-10 sm:px-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.16),transparent_24%)]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/25 to-slate-950/75" />

                  <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sky-400/30 to-indigo-500/30 blur-2xl" />
                        <img
                          src={avatar_url}
                          alt={login}
                          className="relative h-28 w-28 rounded-[2rem] border border-white/15 object-cover shadow-[0_18px_50px_rgba(15,23,42,0.55)] sm:h-32 sm:w-32"
                        />
                      </div>

                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="chip bg-sky-400/10 text-sky-200">
                            <FaGithub />
                            GitHub profile
                          </span>
                          {matchScore > 0 && (
                            <span className="chip border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                              {matchScore}% match
                            </span>
                          )}
                        </div>
                        <Dialog.Title className="text-3xl font-bold text-white sm:text-4xl">
                          {name || login}
                        </Dialog.Title>
                        <p className="mt-2 text-base text-slate-400">@{login}</p>
                        {bio && (
                          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                            {bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <a
                      href={html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary self-start lg:self-auto"
                    >
                      Visit Profile
                      <FaArrowRightLong />
                    </a>
                  </div>
                </div>

                <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-8">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {public_repos !== null && (
                        <Stat label="Repositories" value={public_repos} icon={<FaCodeBranch />} />
                      )}
                      {followers !== null && (
                        <Stat label="Followers" value={followers} icon={<FaUserGroup />} />
                      )}
                      {following !== null && (
                        <Stat label="Following" value={following} icon={<FaUserGroup />} />
                      )}
                    </div>

                    <div className="glass-panel p-5 sm:p-6">
                      <h4 className="mb-5 text-lg font-semibold text-white">Profile Details</h4>
                      <div className="grid gap-5 sm:grid-cols-2">
                        {hireable !== null && (
                          <Details
                            label="Hireable"
                            value={hireable ? "Available for work" : "Not currently hireable"}
                          />
                        )}
                        {company && <Details label="Company" value={company} icon={<FaBuilding />} />}
                        {location && <Details label="Location" value={location} icon={<FaLocationDot />} />}
                        {blog && (
                          <Details
                            label="Website / Blog"
                            value={blog}
                            link
                            icon={<FaLink />}
                          />
                        )}
                        {twitter_username && (
                          <Details
                            label="Twitter"
                            value={`@${twitter_username}`}
                            link={`https://twitter.com/${twitter_username}`}
                            icon={<FaTwitter />}
                          />
                        )}
                        {created_at && (
                          <Details
                            label="Joined GitHub"
                            value={new Date(created_at).toLocaleDateString()}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <h4 className="text-lg font-semibold text-white">Top Repositories</h4>
                      <span className="chip text-slate-300">
                        <FaStar className="text-amber-300" />
                        {repos?.length || 0} listed
                      </span>
                    </div>

                    {repos?.length > 0 ? (
                      <ul className="space-y-3">
                        {repos.map((repo) => (
                          <li
                            key={repo.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-sky-400/20 hover:bg-white/[0.06]"
                          >
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <span className="text-sm font-semibold text-sky-300">
                                {repo.name}
                              </span>
                              {repo.description && (
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                  {repo.description}
                                </p>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-400">
                        No repositories available to preview right now.
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)]">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
        {icon}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function Details({ label, value, icon, link }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
      <h5 className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </h5>
      {link ? (
        <a
          href={link || value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"
        >
          {icon}
          <span className="break-all">{value}</span>
        </a>
      ) : (
        <p className="flex items-center gap-2 text-sm text-slate-300">
          {icon}
          <span>{value}</span>
        </p>
      )}
    </div>
  );
}
