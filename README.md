# 𝙏3𝙘𝒉𝙖𝒕

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F100xEnginners%2Ft3dotgg&env=DATABASE_URL,BETTER_AUTH_SECRET,BETTER_AUTH_URL,BETTER_AUTH_TRUSTED_ORIGINS,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT_URI,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET&envDescription=For%20more%20info%20on%20setting%20up%20your%20API%20keys%2C%20checkout%20the%20Readme%20below&envLink=https%3A%2F%2Fgithub.com%2F100xEnginners%2Ft3dotgg%2Fblob%2Fmain%2FREADME.md&project-name=zero-email&repository-name=zero-email&redirect-url=zero.email&demo-title=Zero&demo-description=An%20open%20source%20email%20app&demo-url=zero.email)

An Open-Source Version of t3.chat.

## What is T3.chat?

T3 Chat is a fast and sleek AI chat application.

it's "best AI chat app ever made" ~ Theo

## Why T3chat?
It supports different LLM, respond very fast, user friendly, have customization, cheap.
  - ✅ **Open-Source** – No hidden agendas, fully transparent.
  - 🚀 **Developer-Friendly** – Built with extensibility and integrations in mind.

## Tech Stack

T3 is built with modern and reliable technologies:

- **Frontend**: Next.js, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Google OAuth
- **Overall**: We're using t3 stack 💙
<!-- - **Testing**: Jest, React Testing Library -->

## Getting Started

### Prerequisites

**Required Versions:**

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker >= 20.10.0

Before running the application, you'll need to set up several services and environment variables:

For more in-depth information on environment variables, please refer to the [Environment Variables](#environment-variables) section.


1. **Setup Local**

   - Make sure you have [Docker](https://docs.docker.com/get-docker/), [NodeJS](https://nodejs.org/en/download/), and [bun](https://bun.sh/docs/installation) installed.
   - Open codebase as a container in [VSCode](https://code.visualstudio.com/) or your favorite VSCode fork.
   - Run the following commands in order to populate your dependencies and setup docker

     ```
     bun install
     ```

   - Run the following commands if you are unable to start any of the services

     ```
     rm -rf node_modules
     ```

2. **Next Auth Setup**

   - Open the `.env` file and change the AUTH_SECRET to string given below.

     ```env
     AUTH_SECRET= 'authjs.session-token'
     ```

3. **Google OAuth Setup**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - Development:
       - `http://localhost:3000`
       - `http://localhost:3000/api/auth/google/callback`
     - Production:
       - `https://your-production-url`
       - `https://your-production-url/api/auth/google/callback`
   - Add to `.env`:

     ```env
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     ```
### Environment Variables

Copy `.env.example` located in  `.env` in the configure the following variables:

```env
# Auth
AUTH_TRUST_HOST= 
AUTH_SECRET=     # Required: Secret key for authentication

# Google OAuth ( Required )
GOOGLE_CLIENT_ID=      
GOOGLE_CLIENT_SECRET=  

# Turnstile ( Required )
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SITE_KEY=
TURNSTILE_SITE_SECRET=

# Stripe ( Required )
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Upstash ( Required )
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN = 

# Mail ( Optional )
MAIL_APP_USER =
MAIL_APP_PASSWORD = 

# TypeGPT ( Required )
NEXT_PUBLIC_TYPEGPT_API_KEY=
TYPEGPT_API_KEY=
TYPEGPT_API_URL=

# Discord webhook ( Optinal )
WEBHOOK_URL

# Database ( Required )
DATABASE_URL=    
```

Migration the database by running `bunx prisma migrate dev` and generate prisma client `bunx prisma generate`.


### Running Locally

Run the development server:

```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contribute

Contributions are welcome ❤️.