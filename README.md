# vavrovi.wedding

## Cloudflare D1 setup

Update `wrangler.jsonc` with the correct database id.

```sh
npx wrangler d1 create vavrovi-wedding
```

Copy the `database_id` from the output and replace `REPLACE_WITH_DATABASE_ID` in `wrangler.jsonc`.

## Migrations

Apply migrations locally and remotely.

```sh
npx wrangler d1 migrations apply vavrovi-wedding --local
npx wrangler d1 migrations apply vavrovi-wedding --remote
```

## Querying submissions

Local and remote examples:

```sh
npx wrangler d1 execute vavrovi-wedding --local --command "select * from rsvp_submissions order by created_at desc;"
npx wrangler d1 execute vavrovi-wedding --remote --command "select * from rsvp_submissions order by created_at desc;"
```
