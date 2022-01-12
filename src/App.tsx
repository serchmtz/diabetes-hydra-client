import { Grommet } from "grommet";
import { HydraProvider } from "./lib/HydraContext";
import HydraApiView from "./components/HydraApiView";
import EndPointInput from "./components/EndPointInput";
import diabetes from "./lib/theme";

function App() {
  return (
    <Grommet theme={diabetes} themeMode="light">
      <EndPointInput />
      <HydraApiView />
    </Grommet>
  );
}
const HydraClientApp = () => {
  return (
    <HydraProvider>
      <App />
    </HydraProvider>
  );
};
export default HydraClientApp;
