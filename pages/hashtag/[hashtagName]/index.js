import { useSelector } from "react-redux";
import Hashtag from "../../../components/Hashtag";
import Trend from "../../../components/Trend";

function HashtagPage() {
  const user = useSelector((state) => state.users.value);
  return (
    <div>
      <Hashtag/>
    </div>
  );
}

export default HashtagPage;
