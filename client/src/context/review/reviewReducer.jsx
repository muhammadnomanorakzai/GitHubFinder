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

const reviewReducer = (state, action) => {
  switch (action.type) {
    case REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.payload,
        error: null,
      };
    case REVIEWS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case REVIEW_CREATE_START:
      return {
        ...state,
        submitting: true,
        error: null,
      };
    case REVIEW_CREATE_SUCCESS:
      return {
        ...state,
        submitting: false,
        reviews: action.payload,
        error: null,
      };
    case REVIEW_UPDATE_SUCCESS:
      return {
        ...state,
        submitting: false,
        reviews: action.payload,
        error: null,
      };
    case REVIEW_DELETE_SUCCESS:
      return {
        ...state,
        reviews: action.payload,
        error: null,
      };
    case REVIEW_CREATE_FAILURE:
      return {
        ...state,
        submitting: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reviewReducer;

