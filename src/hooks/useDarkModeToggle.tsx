import { useEffect, useState } from 'react';
import { fetchDarkModeSetting } from '../constants/DarkMode';

const useDarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchInitialSetting = async () => {
      const setting = await fetchDarkModeSetting();
      setDarkMode(setting);
    };

    fetchInitialSetting();

    const intervalId = setInterval(async () => {
      const darkModeSetting = await fetchDarkModeSetting();
      setDarkMode(darkModeSetting);
    }, 100);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return darkMode;
};

export default useDarkModeToggle;
