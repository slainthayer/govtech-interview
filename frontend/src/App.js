import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inventory from "./pages/inventory";
import Add from "./pages/add";


function App() {
  return (
    <div className="App">
     <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Inventory />}/>
          <Route path="/add" element={<Add />} />
        </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
