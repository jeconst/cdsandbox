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
bin/build <tag>
```

### Test

```
docker run --rm cdsandbox-test:<tag>
# TODO: With database
```

### Run (locally)

```
docker run --rm -p 8080:80 cdsandbox:<tag>
```

### Deploy

```
bin/deploy <tag>
```
