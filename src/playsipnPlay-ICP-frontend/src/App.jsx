import AllRoutes from "./AllRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div id="root" className="text-white max-w-[1700px] mx-auto ">
      <AllRoutes />
      <Toaster />
    </div>
  );
}

export default App;