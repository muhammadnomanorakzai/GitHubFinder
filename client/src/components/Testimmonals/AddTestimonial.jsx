import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaGithub, FaPlus, FaStar, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth/authContext";
import { useReviews } from "../../context/review/reviewContext";

const initialFormState = {
  reviewText: "",
  rating: 5,
};

export default function ReviewSection() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    getGitHubLoginUrl,
    logout,
  } = useAuth();
  const {
    reviews,
    loading,
    submitting,
    error,
    createReview,
    updateReview,
    deleteReview,
  } = useReviews();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [reviews.length]);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [reviews],
  );

  const totalPages = Math.ceil(sortedReviews.length / perPage) || 1;
  const currentReviews = sortedReviews.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const openCreateModal = () => {
    if (!isAuthenticated) {
      try {
        window.location.href = getGitHubLoginUrl();
      } catch (authError) {
        toast.error(authError.message);
      }
      return;
    }

    setMode("create");
    setEditingReviewId(null);
    setForm(initialFormState);
    setOpen(true);
  };

  const openEditModal = (review) => {
    setMode("edit");
    setEditingReviewId(review._id);
    setForm({
      reviewText: review.reviewText,
      rating: review.rating,
    });
    setOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setOpen(false);
    setEditingReviewId(null);
    setForm(initialFormState);
  };

  const handleChange = (event) =>
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

  const selectRating = (rating) =>
    setForm((prev) => ({
      ...prev,
      rating,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (mode === "edit" && editingReviewId) {
        await updateReview(editingReviewId, {
          reviewText: form.reviewText,
          rating: Number(form.rating),
        });
        toast.success("Review updated successfully");
      } else {
        await createReview({
          reviewText: form.reviewText,
          rating: Number(form.rating),
        });
        toast.success("Review published successfully");
      }

      closeModal();
    } catch (submissionError) {
      toast.error(submissionError.message);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully");
    } catch (deleteError) {
      toast.error(deleteError.message);
    }
  };

  const renderStars = (rating, interactive = false) =>
    Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        onClick={interactive ? () => selectRating(index + 1) : undefined}
        className={`h-5 w-5 ${
          index < rating ? "text-amber-300" : "text-slate-600"
        } ${interactive ? "cursor-pointer transition hover:scale-110" : ""}`}
      />
    ));

  return (
    <section className="page-section" id="testimonials">
      <div className="section-shell">
        <div className="section-card overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-kicker">Community Feedback</span>
            <h2 className="premium-title mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Authenticated reviews from real users
            </h2>
            <p className="section-subtitle mx-auto">
              Everyone can browse community feedback. Authenticated GitHub users
              can publish reviews, and only owners can edit or remove their own
              feedback.
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-4 rounded-[26px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {isAuthenticated
                  ? `Signed in as @${user.username}`
                  : "GitHub authentication required for review actions"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Reviews remain public, but create, edit, and delete actions are
                protected server-side.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <button onClick={openCreateModal} className="btn-primary">
                    <FaPlus className="text-xs" />
                    Add Review
                  </button>
                  <button
                    onClick={logout}
                    className="btn-secondary"
                    disabled={authLoading}>
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={openCreateModal}
                  className="btn-primary"
                  disabled={authLoading}>
                  <FaGithub className="text-sm" />
                  Continue with GitHub
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="glass-panel mx-auto mt-12 max-w-3xl p-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-sky-400/20 border-t-sky-300" />
              <p className="text-base font-medium text-white">
                Loading reviews...
              </p>
            </div>
          ) : currentReviews.length === 0 ? (
            <div className="glass-panel mx-auto mt-12 max-w-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white">No reviews yet</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Be the first authenticated GitHub user to share feedback about
                GitHub Finder.
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
              {currentReviews.map((review) => {
                const isOwner = user?.id === review.user?._id;

                return (
                  <article
                    key={review._id}
                    className="glass-panel rounded-[26px] p-4 transition duration-300 hover:-translate-y-1">
                    <header className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={review.user?.avatar}
                          alt={review.user?.username}
                          className="h-16 w-16 rounded-2xl border border-sky-400/20 object-cover shadow-[0_12px_30px_rgba(15,23,42,0.35)]"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            @{review.user?.username}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {isOwner && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(review)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 hover:border-sky-400/25 hover:text-sky-200"
                            aria-label="Edit review">
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 hover:border-rose-400/25 hover:text-rose-200"
                            aria-label="Delete review">
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </header>

                    <p className="mt-5 text-sm leading-7 text-slate-300">
                      "{review.reviewText}"
                    </p>

                    <footer className="mt-5 flex gap-1">
                      {renderStars(review.rating)}
                    </footer>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-40">
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`inline-flex min-w-[42px] items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold ${
                    currentPage === index + 1
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-300"
                  }`}>
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-40">
                Next
              </button>
            </div>
          )}

          {open && (
            <>
              <div
                className="fixed inset-0 z-[1100] bg-slate-950/80 backdrop-blur-sm"
                onClick={closeModal}
              />
              <div className="fixed inset-0 z-[1110] flex items-center justify-center p-4">
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-slate-950/95 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.75)] backdrop-blur-2xl sm:p-8">
                  <h3 className="text-center text-2xl font-bold text-white">
                    {mode === "edit" ? "Edit Your Review" : "Share Your Review"}
                  </h3>
                  <p className="mt-2 text-center text-sm text-slate-400">
                    Signed in as @{user?.username}. Your ownership is enforced
                    on the backend.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Review
                      </label>
                      <textarea
                        name="reviewText"
                        value={form.reviewText}
                        onChange={handleChange}
                        rows={5}
                        minLength={10}
                        maxLength={500}
                        required
                        className="input-premium resize-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {renderStars(Number(form.rating), true)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary"
                      disabled={submitting}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={submitting}>
                      {submitting
                        ? mode === "edit"
                          ? "Saving..."
                          : "Publishing..."
                        : mode === "edit"
                          ? "Save Changes"
                          : "Publish Review"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
