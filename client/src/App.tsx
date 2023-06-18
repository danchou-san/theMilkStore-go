import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import './types/types';
import Gallery from './components/Gallery/Gallery';
import ProductPage from "./components/ProductPage/ProductPage";

const App = () => {

  return (
    <>
      <nav className='navbar sticky top-0 z-50'>
        <h1 className='navbar-brand phone:text-2xl tablet:text-4xl laptop:text-5xl'>THE MILK STORE</h1>
      </nav>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
