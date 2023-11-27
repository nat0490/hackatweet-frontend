import { useSelector } from "react-redux";
import Home from "../components/Home";
import Login from "../components/Login";
import UserInfo from "../components/UserInfo";

function Index() {
  const user = useSelector((state) => state.users.value);
  console.log(user);

  return <>{user.token ? <Home /> : <Login />}</>;
}

export default Index;
