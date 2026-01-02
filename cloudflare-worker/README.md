# Cloudflare worker for _Calculator? I barely know her!_

## Local `.env` file

```bash
HACK_CLUB_AI_API_KEY="sk-hc-v1-blahblahblahblahblahblah"
```

## Making types work

Details: <https://developers.cloudflare.com/workers/languages/typescript/#generate-types>

```bash
yarn run wrangler types --experimental-include-runtime
```

## Deploying to prod

Upload the API key (you only have to do this once):

```bash
yarn wrangler secret put HACK_CLUB_AI_API_KEY
```

```bash
yarn run deploy
```
