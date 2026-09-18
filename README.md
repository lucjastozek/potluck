# Potluck

Potluck is a small, playful social platform designed as a digital third place: a space for sharing with people you know, without the pressure to perform for a large audience.

The project explores how social media might feel different when it prioritises human connection, small scale, authentic expression, and intentional friction over growth and engagement.

## Design ideas

- **Expressive editor** - Create posts with colour, text effects, animations, and unusual image frames.
- **Hidden like metrics** - People can be notified that a post was liked without public like counts or liker identities.
- **Human moderation** - Posts are reviewed before publication, creating a pause for reflection and community moderation.
- **Small-scale access** - The platform is intended for a bounded group of friends rather than an anonymous broadcast audience.

## Tech stack

- React and TypeScript
- Vite
- React Router
- TipTap editor
- Material UI
- Axe, Pa11y, and Lighthouse accessibility checks

## Getting started

You need Node.js 20 or newer and Yarn 1.x.

```bash
git clone <repository-url>
cd potluck
yarn install
yarn start
```

The frontend runs at [http://localhost:3000](http://localhost:3000).

The app expects an API server at `http://localhost:3001` by default. To use another API URL, create a `.env.local` file:

```bash
VITE_API_URL=http://localhost:3001
```

The API is not included in this repository.

## Available commands

```bash
yarn start          # Start the development server
yarn build          # Type-check and create a production build
yarn preview        # Preview the production build locally
yarn type-check    # Check TypeScript without emitting files
yarn lint           # Run ESLint
```

Accessibility checks are also available:

```bash
yarn a11y:axe
yarn a11y:pa11y
yarn a11y:lighthouse
yarn a11y:all
```

## Project status

Potluck is a speculative design project and working prototype. Its research and testing explored whether a slower, smaller, more expressive social platform could support more comfortable and genuine participation. The findings are early and based on a small, connected group, so the project is not presented as a general solution to social media design.
