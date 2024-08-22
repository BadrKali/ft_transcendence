const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');
    const [isLanguageActive, setIsLanguageActive] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({
      code: 'en',
      label: 'English',
    });
  
  
    const toggleDropdown = () => {
      setIsLanguageActive(prevState => !prevState);
    };
  
  
    const changeLanguage = (code, label) => {
        const newLanguage = event.target.value;
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('i18nextLng', newLanguage);
      setSelectedLanguage({ code, label});
      setIsLanguageActive(false);
    };
  
    return (
      <div>
        <button onClick={toggleDropdown} className="languageButton">
          <Icon name='English' className='flagIcon'/> 
          {selectedLanguage.label}
        </button>
        <div className={isLanguageActive ? "dropDwonLanguage LanguageActive" : "dropDwonLanguage"}>
          <div className='dropList'>
            <p className='list' onClick={() => changeLanguage('en', 'English')}>
              <Icon name='English' className='flagIcon'/> English 
            </p>
            <p className='list' onClick={() => changeLanguage('fr', 'Français')}>
              <Icon name='English' className='flagIcon'/>  Français
            </p>
            <p className='list' onClick={() => changeLanguage('ar', 'العربية')}>
              <Icon name='English' className='flagIcon'/>  العربية
            </p>
          </div>
        </div>
      </div>
    );
  };