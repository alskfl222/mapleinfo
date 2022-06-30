import axios from 'axios';
import useSWR from 'swr';

const fetcher = (uri: string) => axios.get(uri).then((res) => res.data);

export default function Viewer(props: { char: string }) {
  const { char } = props;
  const { data, error } = useSWR(`http://localhost:4000/char/${char}`, fetcher);
  if (error) {
    console.log(error);
    return <div>ERROR</div>;
  }
  if (!data) {
    return <div>LOADING...</div>;
  }
  return (
    <div>
      {Object.keys(data).map((key) => {
        return (
          <div key={key}>
            {key} : {data[key]}
          </div>
        );
      })}
    </div>
  );
}
