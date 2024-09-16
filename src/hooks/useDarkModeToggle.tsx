import { useEffect, useState } from 'react';
import { fetchDarkModeSetting } from '../constants/DarkMode';

const useDarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDarkMode = async () => {
      const darkModeSetting = await fetchDarkModeSetting();
      setDarkMode(darkModeSetting);
    };
  
    fetchDarkMode();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDarkModeSetting().then((darkModeSetting) => {
        setDarkMode(darkModeSetting);
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return darkMode;
};

export default useDarkModeToggle;
