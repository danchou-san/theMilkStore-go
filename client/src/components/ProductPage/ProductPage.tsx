import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../../assets/milk.png';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
  const [data, setData] = useState<Product | null>(null);
  const { productId } = useParams<{ productId: string }>();
  const [value, setValue] = useState(1);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const orderToast = () => {
    toast.success('Order is made!', { autoClose: 3000 });
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${productId}`);
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };

    fetchProductData();
  }, []);

  return (
    <div className='p-4 mt-10 flex flex-col items-center'>
      <div className='p-4 bg-white mb-10 rounded-md border-2 border-solid border-neutral-200'>
      <Link to='/' className='flex flex-row items-center'>
        <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd">
              </path>
          </svg>
          <button>Back</button>
      </Link>
      
        <div className='flex justify-center laptop:flex-row phone:flex-col'>
          <div className='flex justify-center p-10'>
            <img className='w-80 mt-2 mb-8' src={logo} alt='Not Found :(' />
          </div>

          <div className='laptop:p-8 phone:p-4'>
            <p>{data?.name}</p>
            <p className='text-neutral-500'>{data?.type}</p>
            <p className='text-neutral-500'>{data?.storage} liter</p>
            <br />
            <br />
            <div className="flex flex-col justify-center items-center">
              <input
                type="range"
                min="1"
                max={data?.storage}
                value={value}
                className="w-full h-4 bg-slider rounded-lg appearance-none focus:outline-none accent-white"
                onChange={handleChange}
              />
              <div className="top-[28px] border-2 border-neutral-200 my-2 w-24 text-center bg-white py-2 rounded-md text-sm">
                {value} liter
              </div>
            </div>
            <br />
            <button className='bg-order p-2 px-12 w-full rounded-md' onClick={orderToast}>Order</button>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProductPage;