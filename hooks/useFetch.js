import { useEffect, useState } from "react";

const useFetch = (url, options = {}) => {
    const [ data, setData] = useState(null);
    const [ error, setError] = useState(null);
    const [ isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        (async()=> {
            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch(url, options);
                const json = await res.json();
                setData(json);

            } catch(error) {
                setError(error.message || "Failed to fetch");
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { data, error, isLoading} ;
};

export { useFetch };