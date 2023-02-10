import { useEffect, useRef } from 'react';

const useSocket = () => {
  const socketCreated = useRef(false);
  useEffect(() => {
    if (!socketCreated.current) {
      const socketInitializer = async () => {
        await fetch(
          `${
            process.env.BACKEND_SERVER || 'http://localhost:8000'
          }/v1/socket/new`,
          {
            credentials: 'include',
          }
        );
      };
      try {
        socketInitializer();
        socketCreated.current = true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        throw error;
      }
    }
  }, []);
};

export default useSocket;
