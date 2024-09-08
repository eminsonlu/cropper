import { usePosition } from "./store/position-store";
import Image from "./components/image";
import Input from "./components/input";

function App() {
  const {state} = usePosition();
  return (
    <div className="h-screen bg-black flex justify-center items-center">
      {state.active ? <Image /> : <Input />}
    </div>
  );
}

export default App;
