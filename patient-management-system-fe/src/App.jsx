import { BrowserRouter, Routes, Route } from "react-router-dom";
import mainRoutes from "./routes/appRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {mainRoutes.map((r, _)=> (
          <Route path={r.path} element={r.element} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App;