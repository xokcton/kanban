import { Routes, Route } from 'react-router-dom';
import { AppLayout, AuthLayout } from 'components/layouts';
import { Home, Board, Login, Signup } from 'pages';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'css/custom-scrollbar.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="boards" element={<Home />} />
        <Route path="boards/:boardId" element={<Board />} />
      </Route>
    </Routes>
  );
};

export default App;
