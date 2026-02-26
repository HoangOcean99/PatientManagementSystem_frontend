import { BrowserRouter, Routes, Route } from "react-router-dom";
import mainRoutes from "./routes/appRoutes";
import MainPage from "./pages/commonPage/MainPage";
import commonRoutes from "./routes/commonRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {commonRoutes.map((r, index) => (
          <Route key={index} path={r.path} element={r.element} />
        ))}
        <Route element={<MainPage />}>
          {mainRoutes.map((r, index) => (
            <Route key={index} path={r.path} element={r.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App;