// src/App.jsx
import { Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy, useContext, useState } from "react";
import { Toaster } from "react-hot-toast";

import PageLoader from "./components/common/PageLoader";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Context Providers
import GithubState from "./context/github/GithubState";
import AlertState from "./context/alert/AlertState";
import GithubContext from "./context/github/githubContext";
import AuthState from "./context/auth/AuthState";
import ReviewState from "./context/review/ReviewState";

// Modal
import GitHubProfileModal from "./components/widgets/GitHubProfileModal";

/* Lazy-loaded pages */
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GitHubAuthCallback = lazy(() => import("./pages/GitHubAuthCallback"));

/* Layout wrapper */
function Layout() {
  const { user } = useContext(GithubContext);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Header />
      <main className="flex-1 scroll-smooth pb-4">
        <Outlet context={{ openModal, setOpenModal }} />
      </main>
      <Footer />

      {/* Global Profile Modal */}
      <GitHubProfileModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={user}
        matchScore={90}
      />
    </>
  );
}

export default function App() {
  return (
    <GithubState>
      <AlertState>
        <AuthState>
          <ReviewState>
            <div className="app-shell flex min-h-screen flex-col">
              <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_44%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.14),transparent_30%)]" />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                  </Route>
                  <Route path="/auth/github/callback" element={<GitHubAuthCallback />} />

                  {/* 404 without layout */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              <Toaster
                position="top-center"
                toastOptions={{ style: { fontSize: "14px" } }}
              />
            </div>
          </ReviewState>
        </AuthState>
      </AlertState>
    </GithubState>
  );
}
