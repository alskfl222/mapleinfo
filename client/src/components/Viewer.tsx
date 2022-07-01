import axios from 'axios';
import useSWR from 'swr';

const fetcher = (uri: string) => axios.get(uri).then((res) => res.data);
const IMAGE_SERVER_URL = import.meta.env.VITE_IMAGE_SERVER_URL

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
  const { name, level, exp, date } = data;
  const dateString = date.split('T')[0]
  const imageUrl = `${IMAGE_SERVER_URL}/${dateString}_${name}.png`

  return (
    <div>
      <img src={imageUrl} alt='image'/>
      <h2>{name}</h2>
      <h4>{level}</h4>
      <h5>{exp}</h5>
    </div>
  );
}
