import { useEffect, useReducer } from "react";
import apiClient from "../../lib/apiClient";
import ReviewContext from "./reviewContext";
import reviewReducer from "./reviewReducer";
import {
  REVIEW_CREATE_FAILURE,
  REVIEW_CREATE_START,
  REVIEW_CREATE_SUCCESS,
  REVIEW_DELETE_SUCCESS,
  REVIEWS_FAILURE,
  REVIEWS_REQUEST,
  REVIEWS_SUCCESS,
  REVIEW_UPDATE_SUCCESS,
} from "../types";

const initialState = {
  reviews: [],
  loading: true,
  submitting: false,
  error: null,
};

const ReviewState = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  const fetchReviews = async () => {
    dispatch({ type: REVIEWS_REQUEST });

    try {
      const response = await apiClient.get("/reviews");
      dispatch({
        type: REVIEWS_SUCCESS,
        payload: response.data.data.reviews,
      });
    } catch (error) {
      dispatch({
        type: REVIEWS_FAILURE,
        payload: error.response?.data?.message || "Unable to load reviews",
      });
    }
  };

  const createReview = async (payload) => {
    dispatch({ type: REVIEW_CREATE_START });

    try {
      const response = await apiClient.post("/reviews", payload);
      dispatch({
        type: REVIEW_CREATE_SUCCESS,
        payload: [response.data.data.review, ...state.reviews],
      });
      return response.data.data.review;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to create review";
      dispatch({
        type: REVIEW_CREATE_FAILURE,
        payload: message,
      });
      throw new Error(message);
    }
  };

  const updateReview = async (reviewId, payload) => {
    dispatch({ type: REVIEW_CREATE_START });

    try {
      const response = await apiClient.patch(`/reviews/${reviewId}`, payload);
      dispatch({
        type: REVIEW_UPDATE_SUCCESS,
        payload: state.reviews.map((review) =>
          review._id === reviewId ? response.data.data.review : review
        ),
      });
      return response.data.data.review;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to update review";
      dispatch({
        type: REVIEW_CREATE_FAILURE,
        payload: message,
      });
      throw new Error(message);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await apiClient.delete(`/reviews/${reviewId}`);
      dispatch({
        type: REVIEW_DELETE_SUCCESS,
        payload: state.reviews.filter((review) => review._id !== reviewId),
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to delete review";
      dispatch({
        type: REVIEW_CREATE_FAILURE,
        payload: message,
      });
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        reviews: state.reviews,
        loading: state.loading,
        submitting: state.submitting,
        error: state.error,
        fetchReviews,
        createReview,
        updateReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewState;

