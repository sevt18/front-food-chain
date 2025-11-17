import { useState, useEffect, useRef } from 'react';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiCallRef = useRef(apiCall);

  // Actualizar la referencia cuando cambia la función
  useEffect(() => {
    apiCallRef.current = apiCall;
  }, [apiCall]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCallRef.current();
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          // Si es un error 404, guardar el objeto de error completo para que los componentes puedan verificar el status
          if (err.response?.status === 404) {
            setError(err);
          } else if (err.response?.status === 429) {
            // Error 429: Too Many Requests - mostrar mensaje amigable
            const retryAfter = err.response?.data?.retryAfter || 0;
            const minutes = Math.ceil(retryAfter / 60);
            setError({
              ...err,
              message: `Demasiadas solicitudes. Espera ${minutes} minuto(s) o reinicia el servidor backend.`,
              isRateLimit: true
            });
          } else {
            setError(err.response?.data?.message || err.message || 'Error al cargar los datos');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCallRef.current();
      setData(response.data);
    } catch (err) {
      // Si es un error 404, guardar el objeto de error completo para que los componentes puedan verificar el status
      if (err.response?.status === 404) {
        setError(err);
      } else {
        setError(err.response?.data?.message || err.message || 'Error al cargar los datos');
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};