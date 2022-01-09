# 👷 `worker-maintenanceredirect`

A Cloudflare worker that acts as a maintenance mode middleware. Will check the IP of each request, and return a maintenance mode page to any IP addresses that aren't in the whitelist.

#### Wrangler

Generated using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
