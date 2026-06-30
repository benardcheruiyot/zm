import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WithdrawPage from './pages/WithdrawPage';
import ListPage from './pages/ListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WithdrawPage />} />
        <Route path="/list" element={<ListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
