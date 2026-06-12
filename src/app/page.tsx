"use client";

import {
  CheckCircle2,
  Flame,
  Loader2,
  PlugZap,
  Power,
  Radio,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Address } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { moodLanternAbi } from "@/lib/abi";
import { hasContractAddress, moodLanternAddress } from "@/lib/contract";
import { dataSuffix } from "@/lib/wagmi";

type MoodKey = "calm" | "focus" | "joy";
type TxState = "Idle" | "Pending" | "Confirmed" | "Failed" | "Request rejected";

const moodActions: Array<{
  key: MoodKey;
  label: string;
  method: "lightCalm" | "lightFocus" | "lightJoy";
  beam: string;
  tint: string;
}> = [
  {
    key: "calm",
    label: "Light Calm",
    method: "lightCalm",
    beam: "A green lantern opens a quieter path.",
    tint: "from-emerald-300 via-cyan-200 to-sky-300",
  },
  {
    key: "focus",
    label: "Light Focus",
    method: "lightFocus",
    beam: "A blue rail sharpens the garden line.",
    tint: "from-blue-300 via-indigo-200 to-violet-200",
  },
  {
    key: "joy",
    label: "Light Joy",
    method: "lightJoy",
    beam: "An amber glow lifts the night canopy.",
    tint: "from-amber-200 via-rose-200 to-violet-200",
  },
];

const userFunctionByMood: Record<MoodKey, "userCalms" | "userFocuses" | "userJoys"> = {
  calm: "userCalms",
  focus: "userFocuses",
  joy: "userJoys",
};

const totalFunctionByMood: Record<
  MoodKey,
  "totalCalms" | "totalFocuses" | "totalJoys"
> = {
  calm: "totalCalms",
  focus: "totalFocuses",
  joy: "totalJoys",
};

function shortAddress(address?: string) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function friendlyError(error: unknown): TxState {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("reject") || message.includes("denied")) {
    return "Request rejected";
  }
  return "Failed";
}

function formatCount(value: unknown) {
  if (typeof value === "bigint") return value.toLocaleString("en-US");
  return "0";
}

export default function Home() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [lastAction, setLastAction] = useState<MoodKey | null>(null);
  const [lastStatus, setLastStatus] = useState<TxState>("Idle");
  const [lastHash, setLastHash] = useState<`0x${string}` | undefined>();

  const { address, isConnected, chain } = useAccount();
  const { connectors, connectAsync, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const readContracts = useMemo(() => {
    const account = (address ?? "0x0000000000000000000000000000000000000000") as Address;
    return moodActions.flatMap((action) => [
      {
        address: moodLanternAddress,
        abi: moodLanternAbi,
        functionName: userFunctionByMood[action.key],
        args: [account],
        chainId: base.id,
      },
      {
        address: moodLanternAddress,
        abi: moodLanternAbi,
        functionName: totalFunctionByMood[action.key],
        chainId: base.id,
      },
    ]);
  }, [address]);

  const {
    data: counts,
    refetch,
    isLoading: isLoadingCounts,
  } = useReadContracts({
    contracts: readContracts,
    query: {
      enabled: hasContractAddress,
      refetchInterval: isConnected ? 12000 : false,
    },
  });

  const receipt = useWaitForTransactionReceipt({
    hash: lastHash,
    chainId: base.id,
    query: {
      enabled: Boolean(lastHash),
    },
  });

  useEffect(() => {
    if (receipt.isSuccess) {
      void refetch();
    }
  }, [receipt.isSuccess, refetch]);

  async function connectWallet(connectorId: string) {
    const connector = connectors.find((item) => item.id === connectorId);
    if (!connector) return;

    try {
      await connectAsync({ connector, chainId: base.id });
      setWalletOpen(false);
      setLastStatus("Idle");
    } catch (error) {
      console.error("Wallet connection issue", error);
      setLastStatus(friendlyError(error));
    }
  }

  async function lightMood(action: (typeof moodActions)[number]) {
    if (!hasContractAddress) {
      setLastAction(action.key);
      setLastStatus("Failed");
      return;
    }

    try {
      setLastAction(action.key);
      setLastStatus("Pending");
      const hash = await writeContractAsync({
        address: moodLanternAddress,
        abi: moodLanternAbi,
        functionName: action.method,
        chainId: base.id,
        dataSuffix,
      });

      setLastHash(hash);
    } catch (error) {
      console.error("Mood lantern transaction issue", error);
      setLastStatus(friendlyError(error));
    }
  }

  const walletStatus = isConnected
    ? chain?.id === base.id
      ? "Connected on Base"
      : "Switch to Base"
    : "Ready to connect";

  const displayedLastStatus: TxState = receipt.isLoading
    ? "Pending"
    : receipt.isSuccess
      ? "Confirmed"
      : receipt.isError
        ? "Failed"
        : lastStatus;

  return (
    <main className="min-h-screen overflow-hidden bg-[#07130f] text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(99,232,186,0.34),transparent_32%),radial-gradient(circle_at_82%_7%,rgba(78,126,255,0.31),transparent_29%),radial-gradient(circle_at_65%_75%,rgba(255,188,87,0.24),transparent_36%),linear-gradient(160deg,#08140f_0%,#10253a_45%,#1b1533_100%)]" />
      <div className="absolute left-1/2 top-6 -z-0 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-white/12 bg-white/10 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 place-items-center rounded-[8px] bg-amber-200 text-emerald-950 shadow-lg shadow-amber-200/25">
              <Flame className="size-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold">Mood Lantern</h1>
              <p className="text-xs text-emerald-100/75">{walletStatus}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-white/12 px-3 py-2 text-xs text-emerald-100/80 sm:flex">
              <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
              {shortAddress(address)}
            </span>
            {isConnected ? (
              <button
                className="grid size-11 place-items-center rounded-[8px] border border-white/15 bg-white/10 text-white transition hover:bg-white/18"
                onClick={() => disconnect()}
                aria-label="Disconnect wallet"
                title="Disconnect wallet"
              >
                <Power className="size-5" />
              </button>
            ) : null}
            <button
              className="flex h-11 items-center gap-2 rounded-[8px] bg-[#4f7cff] px-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition hover:bg-[#6a91ff]"
              onClick={() => setWalletOpen(true)}
              type="button"
            >
              <Wallet className="size-4" />
              {isConnected ? "Wallet" : "Connect"}
            </button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-5 py-5 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[8px] border border-white/12 bg-white/[0.08] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">
            <div className="absolute inset-x-6 top-10 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
            <div className="absolute bottom-16 left-4 right-4 h-20 rounded-full bg-amber-200/10 blur-2xl" />
            <div className="relative flex h-full min-h-[380px] flex-col justify-between">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1 text-xs text-emerald-100">
                  <Radio className="size-3.5" />
                  Base onchain garden
                </p>
                <h2 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
                  Light a mood, see the garden answer.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-50/72">
                  Three simple onchain lanterns. No token, no points, no rewards, no invitation loops. You only pay Base gas.
                </p>
              </div>

              <div className="relative mt-8 h-52 overflow-hidden rounded-[8px] border border-white/10 bg-[#081c1d]/70">
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(121,242,202,0.12)_28%,transparent_44%,rgba(81,125,255,0.15)_62%,transparent_82%)]" />
                <div className="absolute left-6 right-6 top-10 h-2 rounded-full bg-gradient-to-r from-emerald-200/20 via-cyan-100/70 to-amber-200/20 blur-sm" />
                {[0, 1, 2, 3, 4].map((item) => (
                  <div
                    className="absolute top-10 flex flex-col items-center"
                    style={{ left: `${10 + item * 20}%` }}
                    key={item}
                  >
                    <div className="h-10 w-px bg-cyan-100/25" />
                    <div className="h-12 w-9 rounded-b-full rounded-t-[8px] border border-amber-100/45 bg-gradient-to-b from-amber-100/90 to-amber-300/25 shadow-[0_0_26px_rgba(251,191,36,0.42)]" />
                  </div>
                ))}
                <div className="absolute bottom-6 left-5 right-5 grid grid-cols-3 gap-2">
                  {moodActions.map((action) => (
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${action.tint} opacity-80`}
                      key={action.key}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <section className="rounded-[8px] border border-white/12 bg-white/[0.09] p-4 shadow-xl shadow-black/15 backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Lantern Actions</h2>
                  <p className="text-xs text-emerald-100/65">Only these buttons send onchain writes.</p>
                </div>
                <Sparkles className="size-5 text-amber-200" />
              </div>
              <div className="grid gap-3">
                {moodActions.map((action) => (
                  <button
                    className={`group rounded-[8px] border border-white/12 bg-gradient-to-r ${action.tint} p-[1px] text-left transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-55`}
                    disabled={!isConnected || isWriting || chain?.id !== base.id}
                    key={action.key}
                    onClick={() => lightMood(action)}
                    type="button"
                  >
                    <span className="flex min-h-20 items-center justify-between gap-3 rounded-[7px] bg-[#081414]/88 px-4 py-3">
                      <span>
                        <span className="block text-base font-semibold text-white">
                          {action.label}
                        </span>
                        <span className="mt-1 block text-xs text-emerald-100/65">
                          {action.beam}
                        </span>
                      </span>
                      {isWriting && lastAction === action.key ? (
                        <Loader2 className="size-5 animate-spin text-cyan-100" />
                      ) : (
                        <PlugZap className="size-5 text-amber-100 transition group-hover:text-white" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              {moodActions.map((action, index) => (
                <div
                  className="rounded-[8px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur-xl"
                  key={action.key}
                >
                  <p className="text-xs uppercase tracking-wide text-emerald-100/55">
                    {action.key}
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    My {action.key === "calm" ? "Calms" : action.key === "focus" ? "Focuses" : "Joys"}
                  </p>
                  <p className="text-2xl font-semibold">
                    {isLoadingCounts ? "..." : formatCount(counts?.[index * 2]?.result)}
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    Total {action.key === "calm" ? "Calms" : action.key === "focus" ? "Focuses" : "Joys"}
                  </p>
                  <p className="text-2xl font-semibold">
                    {isLoadingCounts ? "..." : formatCount(counts?.[index * 2 + 1]?.result)}
                  </p>
                </div>
              ))}
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[8px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-wide text-emerald-100/55">
                  Wallet Status
                </p>
                <p className="mt-2 text-lg font-semibold">{walletStatus}</p>
                <p className="mt-1 text-sm text-emerald-50/65">{shortAddress(address)}</p>
              </div>
              <div className="rounded-[8px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-wide text-emerald-100/55">
                  Last Transaction
                </p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  {displayedLastStatus === "Confirmed" ? (
                    <CheckCircle2 className="size-5 text-emerald-200" />
                  ) : null}
                  {displayedLastStatus}
                </p>
                <p className="mt-1 text-sm text-emerald-50/65">
                  {lastAction ? `Latest action: ${lastAction}` : "No recent activity"}
                </p>
              </div>
            </section>

            {!hasContractAddress ? (
              <p className="rounded-[8px] border border-amber-200/30 bg-amber-200/10 px-4 py-3 text-sm text-amber-50">
                Contract setup is pending. Add the deployed Base contract address before sending transactions.
              </p>
            ) : null}
          </div>
        </section>
      </section>

      {walletOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/55 p-3 backdrop-blur-sm sm:place-items-center">
          <div className="w-full max-w-sm rounded-[8px] border border-white/12 bg-[#0b1717] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Choose Wallet</h2>
              <button
                className="grid size-9 place-items-center rounded-[8px] border border-white/12 bg-white/8"
                onClick={() => setWalletOpen(false)}
                type="button"
                aria-label="Close wallet options"
                title="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid gap-2">
              {connectors.map((connector) => (
                <button
                  className="flex h-12 items-center justify-between rounded-[8px] border border-white/12 bg-white/[0.08] px-4 text-left text-sm font-medium transition hover:bg-white/[0.14]"
                  disabled={isConnecting}
                  key={connector.uid}
                  onClick={() => connectWallet(connector.id)}
                  type="button"
                >
                  {connector.name}
                  {isConnecting ? <Loader2 className="size-4 animate-spin" /> : null}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-emerald-50/60">
              Coinbase Wallet, MetaMask, OKX, and the Base App injected wallet can connect through these options when available.
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
