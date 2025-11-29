import { toast } from "sonner";
import { useSelector } from "react-redux";

function RestrictedButton({ onClick, children, className = "" }) {
  const { isAdmin } = useSelector((store) => store.authStore);

  const handleClick = (e) => {
    if (!isAdmin) {
      e.preventDefault();
      toast.error("Only admins can perform this action.");
      return;
    }
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className={`${className} ${!isAdmin ? "opacity-60 cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
}

export default RestrictedButton;
