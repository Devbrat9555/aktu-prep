import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const UserSync = () => {
    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        const syncUserToBackend = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    await axios.post(`${API_BASE_URL}/auth/sync`, {
                        name: user.fullName || user.firstName || 'Student',
                        email: user.primaryEmailAddress?.emailAddress
                    });
                    console.log('User synced with Kernel successfully');
                } catch (err) {
                    console.error('Failed to sync user with Kernel', err);
                }
            }
        };

        syncUserToBackend();
    }, [isLoaded, isSignedIn, user]);

    return null; // This component doesn't render anything
};

export default UserSync;
