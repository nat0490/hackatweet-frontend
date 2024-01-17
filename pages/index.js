import { useSelector } from "react-redux";
import Home from "../components/Home";
import Login from "../components/Login";
import Hashtag from "../components/Hashtag";
import UserInfo from "../components/UserInfo";

function Index() {
  const user = useSelector((state) => state.users.value);
  //console.log(user);

  return <>{!user.token ? 
              (<Login />) : 
              ( <>
                 <Home />  
                 <Hashtag /> 
                </>
              )}</>;
}

export default Index;
