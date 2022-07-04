import { ReactComponent as YoutubeIcon } from "../../../icons/youtube-icon.svg";
import { ReactComponent as PortfolioIcon } from "../../../icons/portfolio-icon.svg";
import { ReactComponent as BMFIcon } from "../../../icons/bmf-icon.svg";
import { ReactComponent as FacebookIcon } from "../../../icons/facebook-icon.svg";
import { ReactComponent as Logo } from "../../../icons/lofifm.svg";
import { MutableRefObject } from "react";
import "./player-info-style.css";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../../recoil/atoms/PlayerState";

export type PlayerInfoProps = {
  infoRef: MutableRefObject<any>;
  player: any;
  onEcashClick(): void;
};

function PlayerInfo({ infoRef, player, onEcashClick }: PlayerInfoProps) {
  const [playerData, setPlayerData] = useRecoilState(PlayerState);

  const handleHeaderClick = () =>
    window.open("https://www.producthunt.com/products/lofi-fm");

  const handleScalingChange = (e: any) => {
    const isChecked = e.target.checked;
    setPlayerData((prev) => ({
      ...prev,
      scalingDisabled: e.target.checked,
    }));
    window.localStorage.setItem("scaling_disabled", JSON.stringify(isChecked));
  };

  return (
    <div className="player-info" ref={infoRef}>
      <div onClick={handleHeaderClick} className="header">
        <div className="logo">
          <Logo />
        </div>
        <div className="app-name">LoFi Fm</div>
      </div>

      <div className="settings">
        <div className="disable-scaling">
          <label
            title="disable scaling to view background video in original size"
            className="switch"
          >
            <input
              type="checkbox"
              checked={playerData.scalingDisabled}
              onChange={handleScalingChange}
            />
            <span className="slider"></span>
            <span className="text">Disable Scaling</span>
          </label>
        </div>
      </div>
      <div className="resources">
        <button
          onClick={() => window.open(player?.playerInfo?.videoUrl)}
          className="btn"
        >
          <YoutubeIcon />
          <span>Play in Youtube</span>
        </button>
        <button
          onClick={() => window.open("https://www.facebook.com/tuannguyen2394/")}
          className="btn gh"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </button>
        <button
          onClick={() => window.open("https://portfolio-five-ebon-39.vercel.app/")}
          className="btn gh"
        >
          <PortfolioIcon />
          <span>Portfolio</span>
        </button>
        <button
          onClick={() => window.open("https://www.buymeacoffee.com/tuannguyentkz")}
          className="btn bmf"
        >
          <BMFIcon />

          <span>Buy me Coffee</span>
        </button>
      </div>
    </div>
  );
}

export default PlayerInfo;
