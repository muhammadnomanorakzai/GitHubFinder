import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../context/auth/authContext";

const OAUTH_CODE_STORAGE_KEY = "ghf_github_oauth_code";

export default function GitHubAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithGitHubCode } = useAuth();
  const [error, setError] = useState("");

  const code = useMemo(() => searchParams.get("code"), [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let isMounted = true;

    async function authenticate() {
      if (!code) {
        setError("Missing GitHub authorization code.");
        return;
      }

      const processedCode = window.sessionStorage.getItem(
        OAUTH_CODE_STORAGE_KEY
      );

      if (processedCode === code) {
        return;
      }

      window.sessionStorage.setItem(OAUTH_CODE_STORAGE_KEY, code);

      try {
        await loginWithGitHubCode(code);
        if (isMounted) {
          window.sessionStorage.removeItem(OAUTH_CODE_STORAGE_KEY);
          window.location.replace("/#testimonials");
        }
      } catch (authError) {
        if (isMounted) {
          window.sessionStorage.removeItem(OAUTH_CODE_STORAGE_KEY);
          setError(authError.message);
        }
      }
    }

    authenticate();

    return () => {
      isMounted = false;
    };
  }, [code, loginWithGitHubCode, navigate]);

  return (
    <section className="page-section">
      <div className="section-shell">
        <div className="section-card mx-auto max-w-2xl p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-400/10">
            <FaGithub className="text-3xl text-sky-300" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">
            Completing GitHub sign in
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
            We are validating your GitHub identity and creating your secure review session.
          </p>
          {error ? (
            <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : (
            <div className="mx-auto mt-8 h-12 w-12 animate-spin rounded-full border-2 border-sky-400/20 border-t-sky-300" />
          )}
        </div>
      </div>
    </section>
  );
}
