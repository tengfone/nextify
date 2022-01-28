import { LogoutIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { signOut } from "next-auth/react";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "../components/Songs";

const colors = [
  "from-blue-500",
  "from-green-500",
  "from-orange-500",
  "from-purple-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-white-500",
];

export default function Center() {
  const { data: session } = useSession();
  const [color, setColor] = useState();
  const spotifyApi = useSpotify();
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const playlistId = useRecoilValue(playlistIdState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div className="text-white flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt="profilepic"
          />
          <h2>{session?.user.name}</h2>
          <button
            className="flex items-center space-x-2 hover:text-white"
            onClick={() => {
              signOut();
            }}
          >
            <LogoutIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt="playlist"
        />
        <div>
          <p>Playlist</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}
