import { useEffect, useRef } from 'react';

import { backendServerURL } from '@/constants';

const useSocket = () => {
  const socketCreated = useRef(false);
  useEffect(() => {
    if (!socketCreated.current) {
      const socketInitializer = async () => {
        await fetch(`${backendServerURL}/v1/socket/new`, {
          credentials: 'include',
        });
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
