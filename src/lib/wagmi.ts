import { QueryClient } from "@tanstack/react-query";
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const builderCode = "bc_ijtxsohv";

export const dataSuffix =
  "0x62635f696a7478736f68760b0080218021802180218021802180218021" as `0x${string}`;

export const attribution = {
  dataSuffix,
};

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "Mood Lantern",
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export const queryClient = new QueryClient();
