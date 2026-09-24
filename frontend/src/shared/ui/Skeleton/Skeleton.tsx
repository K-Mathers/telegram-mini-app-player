import "./Skeleton.css";

interface ISkeleton {
  width?: string;
  height?: string;
  borderRadius?: string;
}

const Skeleton = ({
  width = "100%",
  height = "16px",
  borderRadius = "8px",
}: ISkeleton) => {
  return <div className="skeleton" style={{ width, height, borderRadius }} />;
};

export default Skeleton;
