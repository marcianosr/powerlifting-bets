import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/leaderboards');
        }
    }, [session, router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            {!session ? (
                <button onClick={() => signIn('google')} style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '10px' }}>
                    Sign in with Google
                </button>
            ) : (
                <button onClick={() => signOut()} style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Sign out
                </button>
            )}
        </div>
    );
};

export default Login;
