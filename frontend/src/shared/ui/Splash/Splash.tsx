import "./Splash.css";

interface ISplash {}

const Splash = ({}: ISplash) => {
  return (
    <div className="loading-screen">
      <div className="title">EMINEM MUSIC</div>
      <div className="spinner"></div>
    </div>
  );
};

export default Splash;
