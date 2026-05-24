import { createContext, useContext } from "react";

const ReviewContext = createContext();

export function useReviews() {
  return useContext(ReviewContext);
}

export default ReviewContext;

