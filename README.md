# 🧱 LifeBlocks

A Tetris-inspired browser game where every block is a financial life decision.

## What is it?

LifeBlocks is a strategy game built around personal finance concepts. You drag blocks onto a 10×20 grid — each block represents a real-life expense or investment (health insurance, fixed deposits, assets, liabilities, etc.). When you complete a row, your returns depend on the quality of your decisions.

Good rows (investments, insured blocks) return profit. Bad rows (drinking, liability) return losses. Your insurance balance is your capital — spend it wisely.

## Gameplay

- **Drag blocks** from the tray onto the board
- **Complete rows** to realize returns on your investments
- **Manage your capital** — placing blocks costs money, clearing rows earns it back
- **Rotate blocks** with the ↻ button in the tray
- **Pause anytime** to plan your next move

## Block Types

| Block | Risk | Description |
|-------|------|-------------|
| 🏥 Health | Medium | Essential expense, moderate risk |
| 💰 Fixed Deposit | Low | Stable returns, bonus reward |
| 📈 Assets | Low | Long-term investment boost |
| 🛡️ Insurance | Low | Reduces row penalties |
| 🚗 Vehicle | Medium | Depreciating asset |
| 🏠 Property | Medium | Long-term value |
| 🎭 Lifestyle | Medium | Discretionary spending |
| 🍺 Drinking | High | Heavy penalty on row clear |
| ⚠️ Liability | High | Recurring penalty |

## Starting Modes

| Mode | Capital | Playstyle |
|------|---------|-----------|
| Starter | ₹20,000 | Tight budget, high stakes |
| Standard | ₹50,000 | Balanced gameplay |
| Premium | ₹1,00,000 | Room to experiment |

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [react-dnd](https://react-dnd.github.io/react-dnd/) + [dnd-multi-backend](https://github.com/louisbrunner/dnd-multi-backend) (drag & drop, touch support)
- [Framer Motion](https://www.framer.com/motion/) (animations)

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT
