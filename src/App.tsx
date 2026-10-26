import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
export default function App() {
    return <AppProvider><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><div className="app-layout"><Routes>
    <Route path="/" element={<HomePage />}/>
    <Route path="/about" element={<AboutPage />}/>
    <Route path="*" element={<NotFoundPage />}/>
  </Routes></div></BrowserRouter></AppProvider>;
}
