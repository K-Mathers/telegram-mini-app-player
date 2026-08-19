import { Provider } from "react-redux";
import { store } from "../store";

interface IStoreProvider {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: IStoreProvider) => {
  return <Provider store={store}>{children}</Provider>;
};
