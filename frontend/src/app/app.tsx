import { Routing } from "../pages/routes";

interface Iapp {}

export const App = ({}: Iapp) => {
  return (
    <div className="app">
      <Routing />
    </div>
  );
};
