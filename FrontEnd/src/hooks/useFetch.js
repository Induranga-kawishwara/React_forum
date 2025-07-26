import { useState, useEffect } from "react";
import API from "../api/axios";

export default function useFetch(endpoint, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get(endpoint)
      .then((r) => setData(r.data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, deps);

  return { data, loading, error };
}
