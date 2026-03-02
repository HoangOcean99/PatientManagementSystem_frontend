// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import mainRoutes from "./routes/appRoutes";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {mainRoutes.map((r, _)=> (
//           <Route path={r.path} element={r.element} />
//         ))}
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import ĐÚNG TÊN biến và ĐÚNG TÊN FILE bạn vừa lưu
import receptionistRoutes from "./routes/receptionistRoutes"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {receptionistRoutes.map((r, index) => (
          // Thêm key={index} để không bị lỗi
          <Route key={index} path={r.path} element={r.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;