import { useContext, createContext, useEffect, useState } from "react";
import HydraClientFactory, {
  IHydraClient,
  IApiDocumentation,
  IHypermediaContainer,
  IClass,
} from "@hydra-cg/heracles.ts";

const hydraClient = HydraClientFactory.configure()
  .withDefaults()
  .withAllLinks()
  .withJsonLd()
  .andCreate();

const getApiDoc = async (endpoint: string) => {
  return await hydraClient.getApiDocumentation(endpoint);
};

interface HydraContextData {
  error: Error | null;
  loading: boolean;
  hydraClient: IHydraClient;
  apiDoc: IApiDocumentation | null;
  hypermedia: IHypermediaContainer | null;
  entryPoint: IHypermediaContainer | null;
  setHypermedia: (hypermedia: IHypermediaContainer | null) => void;
  hydraClass: IClass | null;
  setClass: (hydraClass: IClass | null) => void;
  endpoint: string;
  setEndpoint: (
    iri: string,
    hypermedia?: IHypermediaContainer
  ) => Promise<void>;
}

const defaultContextValue: HydraContextData = {
  error: null,
  loading: true,
  hydraClient: hydraClient,
  apiDoc: null,
  hypermedia: null,
  entryPoint: null,
  setHypermedia: (_hypermedia) => {},
  hydraClass: null,
  setClass: (_hydraClass) => {},
  endpoint:
    process.env.REACT_APP_DEFAULT_END_POINT || "http://localhost:8080/api",
  setEndpoint: async (_iri) => {},
};

export const HydraContext =
  createContext<HydraContextData>(defaultContextValue);

export const useHydra = () => {
  return useContext(HydraContext);
};

interface Props {}
export const HydraProvider: React.FC<Props> = ({ children }) => {
  const [value, setValue] = useState<HydraContextData>(defaultContextValue);
  useEffect(() => {
    const retrieveDefaultValue = async () => {
      try {
        const apiDoc = await getApiDoc(
          process.env.REACT_APP_DEFAULT_END_POINT || "http://localhost:8080/api"
        );
        const entryPoint = await apiDoc.getEntryPoint();
        const hydraClass = apiDoc.supportedClasses
          .ofIri(entryPoint.type.first())
          .first();
        const setHypermedia = (hypermedia: IHypermediaContainer | null) => {
          setValue((v) => {
            return { ...v, hypermedia: hypermedia };
          });
        };
        const setClass = (hydraClass: IClass | null) => {
          setValue((v) => {
            return { ...v, hydraClass: hydraClass };
          });
        };
        const setEndpoint = async (
          iri: string,
          hypermedia?: IHypermediaContainer
        ) => {
          try {
            let _apiDoc = apiDoc;
            let _entryPoint = entryPoint;

            setValue((v) => {
              _apiDoc = v.apiDoc || apiDoc;
              _entryPoint = v.entryPoint || entryPoint;
              return {
                ...v,
                loading: true,
              };
            });

            const _hypermedia =
              hypermedia || (await hydraClient.getResource(iri));
            const htype = _hypermedia.type.first();
            const link1 = _hypermedia.headers.get("Link");
            const link2 = _entryPoint.headers.get("Link");

            if (link1 !== link2) {
              _apiDoc = await getApiDoc(iri);
              _entryPoint = await _apiDoc.getEntryPoint();
            }

            const hydraClass = htype
              ? _apiDoc.supportedClasses.ofIri(htype).first()
              : null;

            setValue((v) => {
              return {
                ...v,
                hypermedia: _hypermedia,
                hydraClass: hydraClass,
                entryPoint: _entryPoint,
                apiDoc: _apiDoc,
                endpoint: iri,
                loading: false,
              };
            });
          } catch (err) {
            console.error(err);
            setValue({ ...defaultContextValue, error: err as Error });
          }
        };
        setValue((v) => {
          return {
            ...v,
            apiDoc: apiDoc,
            entryPoint: entryPoint,
            hypermedia: entryPoint,
            hydraClass: hydraClass,
            setHypermedia: setHypermedia,
            setClass: setClass,
            loading: false,
            setEndpoint: setEndpoint,
            error: null,
          };
        });
      } catch (err) {
        console.log(err);
        setValue({ ...defaultContextValue, error: err as Error });
      }
    };
    retrieveDefaultValue();
  }, []);

  return (
    <HydraContext.Provider value={value}>{children}</HydraContext.Provider>
  );
};
