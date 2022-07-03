/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as PlayIcon } from "../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../icons/pause-icon.svg";
import { ReactComponent as SoundIcon } from "../../icons/sound-icon.svg";
import { ReactComponent as SongsIcon } from "../../icons/songs-icon.svg";
import { ReactComponent as InfoIcon } from "../../icons/info-icon.svg";
import "./player-style.css";
import { Fragment, useEffect, useRef, useState } from "react";
import Slider from "../Slider";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../recoil/atoms/PlayerState";
import { SongsState } from "../../recoil/atoms/SongsState";
import { defaultSongs } from "../../constants/songs";
import { getAllSongs, getVolume } from "../../utils/songs";
import useContainerClick from "use-container-click";
import axios from "axios";
import Cashtab from "./cashtab";
import PlayerInfo from "./player-info";

export type PlayerProps = {
  player: any;
};

function Player({ player }: PlayerProps) {
  const [videoMeta, setVideoMeta] = useState<any>({});
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [songsData, setSongsData] = useRecoilState(SongsState);
  const [showInfo, setShowInfo] = useState<boolean | null>(false);
  const [isCTOpen, setCTOpen] = useState<boolean>(false);

  const infoRef = useRef(document.createElement("div"));
  useContainerClick(infoRef, () => {
    if (infoRef.current) setShowInfo(false);
  });

  const { isPlaying, volume } = playerData as any;

  const getSongsData = async (id: string) => {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&key=${
        import.meta.env.VITE_YT_KEY
      }&id=${id}`
    );
    return response.data.items.map((item: any) => ({
      ...item.snippet,
      id: item.id,
    }));
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const songsIds = getAllSongs();
      const songsArr = await getSongsData(songsIds.join(","));
      console.log({ songsArr });
      setSongsData((prev) => ({ ...prev, songs: songsArr, isLoading: false }));
    };
    fetchSongs();
    window.oncontextmenu = () => {
      setShowInfo(true);
    };

    if (window.location.pathname.includes("ecash")) {
      setCTOpen(true);
    }
  }, []);

  useEffect(() => {
    let timerId: any;

    if (player) {
      timerId = setInterval(() => {
        setVideoMeta({
          duration: player.playerInfo.duration,
          current: player.playerInfo.currentTime,
        });
      }, 1000);
      const vol = getVolume();
      player?.setVolume?.(vol);
      setPlayerData((prev) => ({ ...prev, volume: vol }));
      window.player = player;
    }

    return () => clearInterval(timerId);
  }, [player]);

  useEffect(() => {
    const handler = () => {
      if (!playerData.isPlaying) {
        player.playVideo();
      }
    };

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, [player, playerData.isPlaying]);

  const onPlayPauseClick = () =>
    setPlayerData((prev) => {
      if (player) {
        if (!prev.isPlaying) {
          player.playVideo();
        } else player.pauseVideo();
        return { ...prev, isPlaying: !prev.isPlaying };
      }

      return prev;
    });

  const onPlayListClick = () => {
    setPlayerData((prev) => ({ ...prev, showSongsList: !prev.showSongsList }));
    setCTOpen(false);
  };

  const handleInfoClick = () => {
    setPlayerData((prev) => ({ ...prev, showSongsList: false }));
    setShowInfo((prev) => (prev === null ? false : true));
    setCTOpen(false);
  };

  const handlePrevClick = () => {
    let activeSong = playerData.activeSong;
    let currIndex = defaultSongs.findIndex((s) => s === activeSong);

    if (songsData.isLoading) {
      if (currIndex <= 0) {
        activeSong = defaultSongs[defaultSongs.length - 1];
      } else {
        activeSong = defaultSongs[currIndex - 1];
      }
    } else {
      const songs: any[] = songsData.songs;
      currIndex = songs.findIndex((s: any) => s.id === activeSong);
      if (currIndex <= 0) {
        activeSong = songs[songs.length - 1].id;
      } else {
        activeSong = songs[currIndex - 1].id;
      }
    }

    setPlayerData((prev) => ({
      ...prev,
      activeSong,
    }));
    window.localStorage.setItem("activeSong", activeSong);
  };

  const handleNextClick = () => {
    const songs = songsData.isLoading ? defaultSongs : (songsData.songs as any);
    let activeSong = playerData.activeSong;
    const currIndex: number = songsData.isLoading
      ? defaultSongs.findIndex((s: any) => s === activeSong)
      : songs.findIndex((song: any) => song.id === activeSong);

    console.log({ activeSong, songs, currIndex });

    if (currIndex >= songs.length - 1) {
      activeSong = defaultSongs[0];
    } else {
      activeSong =
        (songsData.isLoading
          ? songs[currIndex + 1]
          : songs[currIndex + 1].id) || defaultSongs[0];
    }

    setPlayerData((prev) => ({
      ...prev,
      activeSong,
    }));

    window.localStorage.setItem("activeSong", activeSong);
  };

  const handleEcashClick = () => {
    setShowInfo(false);
    setCTOpen(true);
  };

  return (
    <Fragment>
      <div onClick={(e) => e.stopPropagation()} className="player-container">
        <div className="player">
          {showInfo && (
            <PlayerInfo
              onEcashClick={handleEcashClick}
              player={player}
              infoRef={infoRef}
            />
          )}

          <div className="title">
            <div className="name">{player?.playerInfo?.videoData?.title}</div>
            <div className="author">
              - {player?.playerInfo?.videoData?.author}
            </div>
          </div>

          {isCTOpen && <Cashtab onClose={() => setCTOpen(false)} />}

          <div className="progress">
            <div className="slidecontainer">
              <Slider
                min={0}
                max={videoMeta.duration}
                className="slider"
                value={videoMeta.current || 0}
                id="myRange"
                onInput={(e) => {
                  const target = e.target as any;
                  const val = parseInt(target.value);
                  player.seekTo(val, true);
                }}
                background="rgb(0 13 53 / 36%)"
              />
            </div>
          </div>
          <div className="actions">
            <div className="secondary-actions">
              <div className="left-section">
                <button onClick={handleInfoClick}>
                  <InfoIcon style={{ paddingLeft: 0 }} />
                </button>
                <button onClick={onPlayListClick}>
                  <SongsIcon />
                </button>
              </div>
              <button onClick={handlePrevClick} className="prev">
                <PlayIcon />
              </button>
            </div>
            <button onClick={() => onPlayPauseClick()} className="play-pause">
              {isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
            </button>
            <div className="secondary-actions">
              <button onClick={handleNextClick} className="next">
                <PlayIcon />
              </button>
              <div className="volume">
                <SoundIcon />
                <Slider
                  min={0}
                  max={100}
                  className="slider"
                  value={volume}
                  id="myRange"
                  onInput={(e: any) => {
                    player.setVolume(e.target.value);
                    setPlayerData((prev) => ({
                      ...prev,
                      volume: e.target.value,
                    }));
                    window.localStorage.setItem(
                      "volume",
                      JSON.stringify(e.target.value)
                    );
                  }}
                  style={{ transform: "scale(0.7)" }}
                  color="#8b90ff"
                  background="rgb(0 13 53 / 10%)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Player;
