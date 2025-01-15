import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

const Logout = () => {
    useEffect(() => {
        signOut({ callbackUrl: '/' });
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;
