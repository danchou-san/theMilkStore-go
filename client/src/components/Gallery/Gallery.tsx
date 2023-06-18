
import { useState, useEffect, useRef, CSSProperties } from "react";
import ProductCard from "../ProductCard/ProductCard";

const Gallery = () => {
  const [data, setData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({});

  const dropdownRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/products');
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };

    fetchProductData();
  }, []);

  const searchedItems = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
  const filteredItems = searchedItems.filter(item => {
      if (selectedTypes.length === 0) {
        return true; // Show all items if no types are selected
      }
      console.log(selectedTypes)
      return selectedTypes.includes(item.type);
    });
  const pageLength = Math.ceil(filteredItems.length / 9);
  const totalPages = pageLength === 0 ? 1 : pageLength;
  const slicedData = filteredItems.slice(currentPage - 1, currentPage + 8);

  const handleCurrentPage = (direction: boolean) => {
    if (direction && currentPage !== pageLength) {
      setCurrentPage(currentPage + 1);
    }
    
    if (!direction && currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  const handleFilterIsOpen = () => {
    setFilterIsOpen(!filterIsOpen);
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setCheckboxes(prevCheckboxes => ({ ...prevCheckboxes, [value]: checked }));

    if (checked) {
      setSelectedTypes(prevSelectedTypes => [...prevSelectedTypes, value]);
    } else {
      setSelectedTypes(prevSelectedTypes => prevSelectedTypes.filter(type => type !== value));
    }
  };

  const uniqueItems = Array.from(new Set(data.map(item => item.type))).map(
    type => data.find(item => item.type === type) as typeof data[number]
  );

  const calculateDropdownPosition = (): CSSProperties | undefined => {
    if (dropdownRef.current) {
      const toggleButtonRect = dropdownRef.current.getBoundingClientRect();
      const { top, left } = toggleButtonRect;
      return {
        top: top - 10,
        left: left - 370,
      };
    }
    return undefined;
  };

  const dropdownPosition = calculateDropdownPosition();

  return (
    <div className='mt-10 flex flex-col items-center'>
      <div className='laptop:w-3/5 tablet:w-3/5 phone:w-10/12'>
        <div className='flex laptop:flex-row phone:flex-col items-center justify-between'>

          <div className="relative laptop:w-card phone:w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                    </path>
                </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-gray-900 border-2 border-neutral-200 rounded-md focus:outline-input-outline"
              placeholder="Search"
              onChange={(e) => handleSearch(e.target.value)}
                />
          </div>
          

          <button
            id='filterButton'
            ref={dropdownRef}
            data-dropdown-toggle='filterDropdown'
            className='px-5 py-2 my-2'
            onClick={() => handleFilterIsOpen()}
          >Filter</button>

          {filterIsOpen && (
            <div
              style={dropdownPosition}
              className='z-50 laptop:absolute bg-white p-4 px-6 laptop:w-filter phone:w-full rounded-md border-2 border-neutral-200'
              >
              <p className='text-gray-500'>Filter</p>
              <p className='font-medium'>Milk Type</p>
              <br />
              <ul className='h-40 overflow-y-scroll'>
                {uniqueItems && uniqueItems.map(item => (
                  <li>
                    <div className='flex items-center pb-2'>
                      <input
                        id={item.name}
                        value={item.type}
                        type="checkbox"
                        className='w-5 h-5 mr-2'
                        onChange={handleCheckboxChange}
                        checked={checkboxes[item.type] || false}
                        />
                      <label htmlFor={item.name}>{item.type}</label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
        
        <br />
        <p className='mx-4'>{data.length} products in stock</p>
        <br />

        <div className='flex flex-wrap justify-between'>
          {slicedData.length > 0 ? (
            slicedData && slicedData.map((item: Product) => (
              <ProductCard name={item.name} type={item.type} storage={item.storage} id={item.id} />
            ))) : (
              <div className='flex justify-center w-full my-20'>
                <p className='text-2xl'>No results &#58;&#40;</p>
              </div>
            )
          }
        </div>
        
        <div className='flex justify-center mb-10'>
          <button 
            onClick={() => handleCurrentPage(false)}
            className='opacity-40 hover:opacity-100 ease-in duration-150 mx-2 flex justify-center items-center w-14 h-14 border-2 border-solid border-slate-800 rounded-md'
            >
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
          </button>

          <div className='mx-2 flex justify-center items-center w-14 h-14 border-2 border-solid border-slate-800 rounded-md'>
            <p>{currentPage}</p>
          </div>

          <div className='flex justify-center items-center mx-2'>
            <p> of </p>
          </div>

          <div className='mx-2 flex justify-center items-center w-14 h-14 border-2 border-solid border-slate-800 rounded-md'>
            <p>{totalPages}</p>
          </div>

          <button
            onClick={() => handleCurrentPage(true)}
            className='opacity-40 hover:opacity-100 ease-in duration-150 mx-2 flex justify-center items-center w-14 h-14 border-2 border-solid border-slate-800 rounded-md'
            >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd">
                </path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Gallery;