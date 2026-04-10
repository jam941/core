import App from '../Components/App';
import { fetchJobs } from '../lib/notion';

export const revalidate = 3600;

export default async function HomePage() {
  const jobs = await fetchJobs();
  return <App initialJobs={jobs} />;
}
