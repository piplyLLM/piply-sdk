# Deploy Instructions

1. Build the monorepo: `npm run build`
2. For landing page: Deploy `apps/landing/dist` to a static host like Vercel or Netlify.
3. For SDK: Publish `packages/piply-sdk` to npm: `cd packages/piply-sdk && npm publish`
4. For docs and playground: Deploy similarly as static sites.
5. Set up relayer and inference nodes on your infrastructure (e.g., AWS, GCP).
6. Configure environment variables as per .env.example.