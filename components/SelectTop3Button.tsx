import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const SelectTop3Button = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [hasSubmitted, setHasSubmitted] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSubmission = async () => {
            if (session?.user?.email) {
                try {
                    const response = await fetch(`/api/check-submission?email=${encodeURIComponent(session.user.email)}`);
                    const data = await response.json();
                    setHasSubmitted(data.hasSubmitted);
                } catch (error) {
                    console.error('Error checking submission:', error);
                }
                setLoading(false);
            }
        };

        checkSubmission();
    }, [session]);

    if (loading || hasSubmitted === null) {
        return <Button label="Loading..." disabled />;
    }

    if (hasSubmitted) {
        return (
            <div className="flex gap-2">
                <Button
                    label="View Selections"
                    onClick={() => router.push('/view-selections')}
                    className="p-button-primary"
                />
                <Button
                    label="Edit Selections"
                    onClick={() => router.push('/select-top3')}
                    className="p-button-secondary"
                />
            </div>
        );
    }

    return (
        <Button
            label="Select Your Top 3"
            onClick={() => router.push('/select-top3')}
            className="p-button-primary"
        />
    );
};
