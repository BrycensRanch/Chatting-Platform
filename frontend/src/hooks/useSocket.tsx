import { useEffect, useRef } from 'react';

const useSocket = () => {
  const socketCreated = useRef(false);
  useEffect(() => {
    if (!socketCreated.current) {
      const socketInitializer = async () => {
        await fetch('http://10.0.0.122:8000/v1/socket/new', {
          // credentials: 'include',
        });
      };
      try {
        socketInitializer();
        socketCreated.current = true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }, []);
};

export default useSocket;
