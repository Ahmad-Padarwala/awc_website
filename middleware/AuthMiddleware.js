import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AuthMiddleware = ({children}) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token'); // Get token from local storage
  
      if (!token) {
        router.push('/admin'); // Redirect to login if no token
      }
  
      // You can also verify the token here using an API call or the jwt.verify method
    }, []);
  

    return children
}

export default AuthMiddleware