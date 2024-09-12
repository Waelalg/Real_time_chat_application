import { useEffect, useState, useCallback } from "react";
import { toast } from 'react-hot-toast';
import throttle from 'lodash/throttle';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    
    // Throttled function to fetch conversations
    const fetchConversations = useCallback(
        throttle(async () => {
            setLoading(true);
            try {
                const res = await fetch('api/users');
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setConversations(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }, 2000), // Throttle to one request per 2 seconds
        []
    );

    useEffect(() => {
        fetchConversations();
        // Clean up throttle on unmount
        return () => {
            fetchConversations.cancel();
        };
    }, [fetchConversations]);

    return { loading, conversations };
}

export default useGetConversations;
