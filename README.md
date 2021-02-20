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
docker build -t cdsandbox:<tag> --target production .
docker build -t cdsandbox_test:<tag> --target test .
```

### Test

```
docker run --rm cdsandbox_test:<tag>
```

TODO: With database

### Run (locally)

```
docker run --rm -p 8080:80 cdsandbox:<tag>
```

### Deploy

```
# TODO
```