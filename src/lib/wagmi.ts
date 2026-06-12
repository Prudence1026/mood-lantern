import { QueryClient } from "@tanstack/react-query";
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const dataSuffix =
  "0x5245504c4143455f574954485f455243383032315f454e434f4445445f535452494e47" as `0x${string}`;

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
