import React, { useEffect, useState } from "react";

const useFetch = (url: string) => {
  // TODO update to a function (performance improvement)
  const localData = window.localStorage.getItem(url);
  const initialData: any = localData ? JSON.parse(localData) : [];
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  const fetchData = async (
    { update }: { update: boolean } = { update: true }
  ) => {
    setError(null);

    try {
      const result = await fetch(url);
      const body = await result.json();

      if (update) {
        setData(body);
      }
      window.localStorage.setItem(url, JSON.stringify(body));
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (initialData && initialData.length) {
      // Still fetch the data but don't update the current data (used for next requests)
      fetchData({ update: false });
      return;
    }
    fetchData();
  }, [url]);

  return { data, error };
};

export default useFetch;
