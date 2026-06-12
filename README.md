# Mood Lantern

Mood Lantern is a Base Mini App with three onchain write actions:

- `Light Calm` calls `lightCalm()`
- `Light Focus` calls `lightFocus()`
- `Light Joy` calls `lightJoy()`

There is no token, no points system, no rewards, no invitation flow, and no app fee. Users only pay Base gas.

## Tech Stack

- Next.js App Router
- TypeScript
- Wagmi
- Viem
- Tailwind CSS

## Required Deployment Values

Replace these placeholders before production verification:

- `src/lib/contract.ts`: set `moodLanternAddress` to the deployed Base contract address.
- `src/lib/wagmi.ts`: replace `dataSuffix` with the ERC-8021 encoded attribution string.
- `src/app/layout.tsx`: replace `REPLACE_WITH_BASE_DEV_VERIFY_TOKEN` in the hard-coded `<meta name="base:app_id">` tag.

The GitHub token, Vercel token, Base verify token, builder code, and deployed contract address were not included in the request. They should not be committed to the frontend.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Contract

The Solidity contract is available at `contracts/MoodLantern.sol`. The frontend ABI in `src/lib/abi.ts` matches that source.
