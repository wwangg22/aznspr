import React, {createContext, useContext, useState, useRef, useEffect} from 'react'
import './options.css'
import url from './url';
import { isMobile } from './ismobile';


export const SelectedOptionsContext = createContext();

export const SelectedOptionsProvider = ({ children }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [keyword, setkeyword] = useState([])

  return (
    <SelectedOptionsContext.Provider value={{ selectedOptions, setSelectedOptions, keyword, setkeyword}}>
      {children}
    </SelectedOptionsContext.Provider>
  );
};


export default function Amazon() {
  
  const [isOpen, setIsOpen] = useState(false);
  const { selectedOptions, setSelectedOptions, keyword, setkeyword } = useContext(SelectedOptionsContext);

  useEffect(()=>{
    async function getKeywords(){
      console.log(`${url.url}/keywords`);
      return fetch(`${url.url}/keywords`,{
      mode: 'cors'
      }).then(response => {
        if (!response.ok){
          throw new Error(`HTTP error: ${response.status}`);
        }
        else{
          return response.json()
        }
      }).then((res) => {console.log(res);
        setkeyword(res.keywords)
        
    
      }).catch((err) => console.error(`Fetch problem: ${err.message}`));
    }
    getKeywords()
  }, [isOpen])
  const dropdownRef = useRef(null);



  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleOptionClick = option => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  function noscroll(){
    document.querySelector('body').style.overflow = "hidden";
    return ''
  }

  function disablenoscroll(){
    document.querySelector('body').style.overflow = 'auto';
    return ''
  }

  return (
      <div className={`dropdown ${isMobile ? 'mobile' : ''}`} ref={dropdownRef}>
        <div className="select-bar" onClick={() => setIsOpen(!isOpen)}>
          select options
        </div>
          <div className={`options-list ${isOpen ? `show${noscroll()}` : `${disablenoscroll()}`}`}>
            {keyword.map(option => (
              <div
                key={option}
                className={`option ${selectedOptions.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
      </div>
  );

}
