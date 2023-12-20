import axios from 'axios';
import { Tracks } from '../../interfaces/index';

const CLIENT_ID = '5405fb39601a4e15b55abe3a8966d6df';
const CLIENT_SECRET = 'be01d27b87754f019906719959f8ddc8';

export const getToken = async () => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: `https://accounts.spotify.com/api/token`,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    });
    return data;
  } catch (error: any) {
    throw new Error('Sorry Server Has no Token');
  }
};

export const getPlaylistArtist = async (
  playlist = '5d3Py9Q7zEAWhnlk89c2mf'
) => {
  try {
    const token = await getToken();

    if (playlist.length > 22) {
      playlist = playlist.slice(-22);
    }
    const limit = 100;
    let isFinish = false;
    let allArtistName: Iterable<any> | null | undefined = [];
    let offset = 0;

    while (!isFinish) {
      const { data } = await axios<Tracks>({
        method: 'get',
        url: `https://api.spotify.com/v1/playlists/${playlist}/tracks?limit=${limit}&offset=${offset}`,
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      const maxOffset = Math.ceil(data.total / limit);

      if (offset === maxOffset) {
        isFinish = true;
      } else {
        const allArtistNameUpdate = data.items.reduce((acc, el) => {
          el.track.artists.forEach((artName) => {
            // @ts-ignore
            return acc.push(artName.name);
          });

          return acc;
        }, []);

        allArtistName = [...allArtistName, ...allArtistNameUpdate];
        offset += 1;
      }
    }

    const uniqName = Array.from(new Set(allArtistName));

    return uniqName;
  } catch (error: any) {
    throw new Error(
      'Sorry Server Has Error Please Try Again Or Not Found playlist'
    );
  }
};
