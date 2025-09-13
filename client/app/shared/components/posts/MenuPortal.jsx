// components/MenuPortal.jsx
import { createPortal } from "react-dom";

export default function MenuPortal({ children }) {
  if (typeof window === "undefined") return null; // for SSR safety
  return createPortal(children, document.body);
}
