import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { useGetUserQuery } from "./features/api/authApi.ts";
import LoadingSpinner from "./components/ui/LoadingSpinner.tsx";
import { ReactNode } from "react";

const CustomLoading = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useGetUserQuery({});
  return <>{isLoading ? <LoadingSpinner /> : <>{children}</>}</>;
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CustomLoading>
        <App />
      </CustomLoading>
    </Provider>
  </StrictMode>
);
