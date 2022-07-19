import axios from 'axios';
import useSWR from 'swr';

const fetcher = (uri: string) => axios.get(uri).then((res) => res.data);
const CHAR_API_URL = import.meta.env.VITE_CHAR_API_URL;

export function useChar(char: string) {
  const { data, error } = useSWR(`${CHAR_API_URL}/${char}`, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    error: error,
  };
}

export function useCharDesc(char: string, type: string) {
  const { data, error } = useSWR(`${CHAR_API_URL}/${char}/${type}`, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    error: error,
  };
}


