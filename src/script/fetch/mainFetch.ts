import config from '../data/config';

class Fetch {
  async mainFetch(req: any, path: string, query?: string) {
    const link = `${config.server}${path}${query || ''}`;
    const res = await fetch(link, req);
    const data: any = await res.json();
    return data;
  }
}

export default Fetch;
