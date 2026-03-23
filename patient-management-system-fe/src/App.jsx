import { BrowserRouter, Routes, Route } from "react-router-dom";
import mainRoutes from "./routes/appRoutes";
import MainPage from "./pages/commonPage/MainPage";
import commonRoutes from "./routes/commonRoutes";
import { AuthProvider } from "./components/security/AuthContext";
import React, { Suspense } from 'react';
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  return (
    <AuthProvider>
 
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex justify-center items-center h-screen bg-gray-50 opacity-60">
            <LoadingSpinner />
          </div>
        }>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;