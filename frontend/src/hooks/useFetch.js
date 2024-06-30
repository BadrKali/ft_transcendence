

import React, { useEffect, useRef, useState } from 'react'

const useFetch = (endpoint) => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const abortControllerRef = useRef()

    useEffect(() => {
        const fetchData = async () => {
            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal;
            setIsLoading(true)
            try {
                const response = await fetch(endpoint, {signal})
                const data = await response.json()
                setData(data)
            }
            catch(e) {
                if(e.name === 'AbortError') {
                    console.log('error fetching data')
                } else {
                    setError(e.message)
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchData();
        return () => {
            if(abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [endpoint])
    return { data, isLoading, error };
}

export default useFetch