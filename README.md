# Quasar App (advanced_language_player)

A Quasar Framework app

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
$ quasar dev -m electron

# ..or the longer form:
$ quasar dev --mode electron

# passing extra parameters and/or options to
# underlying "electron" executable:
$ quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox

# show devtools
$ quasar dev -m electron --devtools
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
$ quasar build -m electron

# ..or the longer form:
$ quasar build --mode electron

# debug mode
$ quasar build -m electron -d

# ..or the longer form
$ quasar build -m electron --debug

# production mode
$ quasar build -m electron -P always

# ..or the longer form:
$ quasar build --mode electron --publish always

# specify using electron-builder
$ quasar build -m electron --bundler builder
```

### Customize the configuration
See [Configuring quasar.conf.js](https://v2.quasar.dev/quasar-cli/quasar-conf-js).
