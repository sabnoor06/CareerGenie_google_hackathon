import { useNavigate } from "react-router-dom";
function UseLogout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };
  return { handleLogout }


}
export default UseLogout;