# Alexander Härenstam - Personal Website

<div align="center">

[![Built with Astro](https://img.shields.io/badge/Astro-0C1120?style=flat&logo=astro&logoColor=white)](https://astro.build/)
[![Deployed on Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Tested with Vitest](https://img.shields.io/badge/Tested_with-Vitest-FCC72B?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat&logo=prettier)](https://github.com/prettier/prettier)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/alehar9320/astro-cloudflare-personal-website/ci.yml?style=flat&logo=githubactions&logoColor=white)](https://github.com/alehar9320/astro-cloudflare-personal-website/actions)
[![Codecov](https://img.shields.io/codecov/c/github/alehar9320/astro-cloudflare-personal-website?style=flat&logo=codecov)](https://codecov.io/gh/alehar9320/astro-cloudflare-personal-website)
[![Snyk Security](https://snyk.io/test/github/alehar9320/astro-cloudflare-personal-website/badge.svg)](https://snyk.io/test/github/alehar9320/astro-cloudflare-personal-website)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](https://opensource.org/licenses/MIT)

</div>

Welcome to the repository for my personal website! I'm **Alexander Härenstam**, a Product Manager at IFS focusing on Developer Experience, based in Stockholm, Sweden.

**🌍 Live Site:** [https://me.alehar.workers.dev](https://me.alehar.workers.dev)

This website serves as my digital portfolio, showcasing my professional journey, skills, projects, and publications.

## 🚀 Technologies

This project is built with a modern web stack designed for speed, SEO, and developer experience:

- **[Astro](https://astro.build/)**: The web framework for building fast, content-focused websites.
- **[Cloudflare Workers](https://workers.cloudflare.com/)**: For fast, secure, and globally distributed hosting with Git-based auto-deploys.
- **HTML/CSS/JS**: Vanilla web technologies, prioritizing lean bundles and performance.

## 🛠 Features

What visitors get on [the live site](https://me.alehar.workers.dev/) today (not a generic portfolio template):

- **Home proof cards**: Short case teasers that deep-link into Work (IFS Design System and related proof).
- **Work**: Indexed case studies under `/work/` (design systems, AI coding copilots, analytics, thesis, and earlier work).
- **Biography**: Role and path at `/biography/` (not a separate About page). Prior published work: Ericsson internships/part-time, 2014–2016 (omitted from the visitor bio on purpose; stays here).
- **Contact / hire**: LinkedIn-only hire path at `/contact/` — [linkedin.com/in/alehar](https://www.linkedin.com/in/alehar/) (no public email, no CV PDF).
- **What's New**: Visitor-facing rewrite of GitHub Releases at `/whats-new/`.
- **Meta pages**: This site (`/this-site/`), What's next (`/roadmap/`), and Site success (`/okr/`).
- **Chat twin**: Docked at the bottom — Alexander's digital twin with his context (it can be wrong).
- **Responsive + accessible chrome**: Fast, keyboard-friendly UI across desktop, tablet, and mobile.

## 🎨 Design & Aesthetics

The project's visual language and theme adhere to the following core principles:

- **Minimalism**: Clean, uncluttered layouts that prioritize readability and typography.
- **Northern Lights**: Dynamic, flowing marine blue and cyan gradient backgrounds explicitly designed to evoke the aurora borealis.
- **Glassmorphism**: Subtle frosted-glass effects, carefully blended translucent backgrounds, and overlay masking create a sense of depth and a modern, premium feel.

## 💻 Local Development

To run this project locally on your machine, follow these steps:

### Prerequisites

- Node.js (v22.12.0 or higher)
- npm or another package manager (yarn, pnpm)

### Installation

1. Clone the repository (if applicable):

   ```sh
   git clone https://github.com/alehar9320/astro-cloudflare-personal-website.git
   cd astro-cloudflare-personal-website
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

Start the local development server:

```sh
npm run dev
```

Navigate to `http://localhost:4321` in your browser to view the site as you make changes. The site will automatically reload upon saving modifications.

### Available Commands

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `npm install`       | Installs dependencies                            |
| `npm run dev`       | Starts local dev server at `localhost:4321`      |
| `npm run build`     | Build your production site to `./dist/`          |
| `npm run preview`   | Preview your build locally, before deploying     |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

## 🌐 Deployment

This project is structured to be deployed primarily on **Cloudflare Workers + Assets**. Push changes to the `main` branch connected to your Cloudflare Git integration and Cloudflare will automatically build using `npm run build` and deploy the output directory (`./dist/`). GitHub Actions handles quality checks plus GitHub release creation; it does not manually deploy production in parallel or push generated release files back to protected `main`.

Render is also supported as a **Node web service**. The repo includes a [render.yaml](./render.yaml) Blueprint that uses:

- `npm install && npm run build`
- `npm run start`
- `NODE_VERSION=22.12.0`

At build time, Render sets `RENDER=true`, which switches Astro to the standalone Node adapter. The Astro config also binds the server to `0.0.0.0`, which Render requires for health checks to pass.

If you deploy on Render, configure any required secrets in the Render dashboard environment settings. Do not commit or mirror local `.env` values into the repository.

## 📬 Contact & Connect

- **LinkedIn:** [Alexander Härenstam](https://www.linkedin.com/in/alehar/)
- **Location:** Stockholm, Sweden

---

_This site's data and structure are continuously refined to reflect current achievements and responsibilities in the tech industry._

## 🤖 Human + AI Collaboration

This website is a product of collaboration between human creativity and Artificial Intelligence. It is designed and optimized for consumption by both humans and AI agents. As such, while every effort is made to ensure quality, content may occasionally contain flaws and should be verified for accuracy.
