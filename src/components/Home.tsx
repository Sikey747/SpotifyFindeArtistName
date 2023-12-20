import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { Audio } from 'react-loader-spinner';
import { useCopyToClipboard } from 'react-use';
import { getPlaylistArtist } from '../api/api';
import SpotifyIcon from '../../public/iconmonstr-spotify-1.svg?react';

function Home() {
  const [playlist, setPlaylist] = useState('');
  const [state, copyToClipboard] = useCopyToClipboard();

  const { data, isLoading, error, refetch } = useQuery<string[]>({
    queryKey: ['artists', playlist],
    queryFn: () => {
      return getPlaylistArtist(playlist);
    },
    enabled: false,
  });

  return (
    <section className="py-4">
      <div className=" max-w-[1440px] mx-auto px-4">
        <div className="pb-8 flex gap-4 justify-center items-center">
          <SpotifyIcon />
          <h1 className="text-3xl font-bold ">
            Fined artist Name from Spotify PlayList
          </h1>
        </div>

        <div className="flex gap-4 items-center justify-between pb-8 max-w-[1000px] mx-auto">
          <Input
            variant="flat"
            color="secondary"
            placeholder="Past Spotify PlayList ID or Link"
            value={playlist}
            onChange={(e) => setPlaylist(e.target.value)}
          />
          <Button
            color="secondary"
            variant="flat"
            type="button"
            onClick={(e) => refetch()}
          >
            Get Artist Name
          </Button>
        </div>
        {error && (
          <p className="mx-auto w-full text-center text-2xl text-red-500">
            {error.message}
          </p>
        )}
        {isLoading && (
          <div className="mx-auto w-full text-center flex items-center justify-center">
            <Audio height="80" width="80" color="#f1f5f9" ariaLabel="loading" />
          </div>
        )}
        {data && (
          <div>
            <h2 className="text-2xl text-center text-green-500 mb-6">
              Found {data.length} artist name in playlist
            </h2>
            <ul className="bg-slate-100 rounded-xl relative p-4">
              <button
                className="absolute top-4 right-4 p-3 bg-secondary-200 hover:bg-secondary-300 rounded-2xl  active:translate-y-[-4px] transition-all "
                type="button"
                onClick={() => copyToClipboard(data.toString())}
              >
                Copy To Clipboard
              </button>
              {data?.map((el) => {
                return (
                  <li key={el} className="text-xl">
                    <article>
                      <h4>{el}</h4>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
