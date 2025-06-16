// main.tsx or index.tsx
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import ClientOverview from "./App";
import Inbox from "./Inbox";
import "./App.css";
import "./index.css";
// import Inbox2 from "./Inbox/components/organisms/Inbox2";
// import Inbox from "./Inbox";

// Get the module type from Vite environment variable
const MODULE_TYPE = import.meta.env.VITE_MODULE_TYPE || "client-overview";

const renderModule = () => {
  switch (MODULE_TYPE.toLowerCase()) {
    case "inbox":
      return <Inbox />;
    // case "inbox":
    //   return <Inbox2 />;
    case "client":
      return <ClientOverview />;
    default:
      return <ClientOverview />;
  }
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <>{renderModule()}</>
  </Provider>
);
