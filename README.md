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

## Deployment Values

These production values are configured:

- `src/lib/contract.ts`: `moodLanternAddress` points to the deployed Base contract address.
- `src/lib/wagmi.ts`: `builderCode` and `dataSuffix` contain the build attribution values.
- `src/app/layout.tsx`: Base and Talent app verification meta tags are present.

GitHub and Vercel tokens are not committed to the frontend.

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
