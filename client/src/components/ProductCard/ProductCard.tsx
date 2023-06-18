  import { Link } from 'react-router-dom';
  import logo from '../../assets/milk.png';

  interface Product {
    name: string,
    type: string,
    storage: number,
    id: string
  }

  const ProductCard = ({name, type, storage, id}: Product) => {
    return (
      <Link to={`/product/${id}`} className='laptop:w-card tablet:w-full p-4 bg-white mb-10 rounded-md border-2 border-solid border-neutral-200 hover:scale-95 ease-in duration-100 cursor-pointer'>
        <div className='flex justify-center'>
          <img className='laptop:w-48 tablet:w-72 phone:p-10 laptop:p-0 tablet:p-0 mt-2 mb-8' src={logo} alt='Not Found :(' />
        </div>
        <div className='flex flex-col laptop:items-start laptop:text-base phone:items-center phone:text-xl'>
          <p>{name}</p>
          <br />
          <div className='flex flex-row w-full justify-between'>
            <p className='text-neutral-400'>{type}</p>
            <p className='text-neutral-400'>{storage} Liter</p>
          </div>
        </div>
      </Link>
    )
  }

  export default ProductCard;