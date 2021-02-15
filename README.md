# cdsandbox

Continuous delivery sandbox.

## Development

### Run tests in watch mode

```
# TODO
```

### Run a development server (live updating)

```
# TODO
```

## Manual Deployment

### Build

```
docker build -t cdsandbox:latest --target production .
docker build -t cdsandbox_test:latest --target test .
```

### Test

```
docker run --rm cdsandbox_test:latest
```

TODO: With database

### Run (locally)

```
docker run --rm -p 8080:80 cdsandbox:latest
```

### Deploy

```
# TODO
```