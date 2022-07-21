import axios from 'axios';
import useSWR from 'swr';

const fetcher = (uri: string) => axios.get(uri).then((res) => res.data);
const API_URL = import.meta.env.VITE_API_URL;

export function useChar(char: string) {
  if (char === '') {
    return { isLoading: true };
  }
  const { data, error } = useSWR(`${API_URL}/char/${char}`, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    error: error,
  };
}

export function useCharDesc(char: string, type: string) {
  if (char === '') {
    return { isLoading: true };
  }
  const { data, error } = useSWR(`${API_URL}/${char}/${type}`, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    error: error,
  };
}
