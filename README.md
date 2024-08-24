<p align="center">
  <img src="./src/assets/logos/stormkit-logo-text-h-white.svg?raw=true" height="90"/>
</p>
<p align="center">
  <i>Stormkit is an infrastructure provider for jamstack applications. It perfectly integrates with popular Git solutions.<br/>Try out Stormkit using our hosted version at <a href="https://app.stormkit.io">app.stormkit.io</a>.</i>
  <br/>
  <br/>
  <img src="./src/assets/images/stormkit-tool.png" alt="Stormkit" width="800" />
</p>

This repository contains code related to the application frontend. You're more than welcome to contribute.

## What is Stormkit?

Stormkit helps developers build, deploy and manage their jamstack applications. It also supports serverless applications.

## Latest development

You can preview the latest development on [https://app.stormkit.io/](https://app.stormkit.io). This will reflect
changes from latest master branch.

## Contributing

If you'd like to contribute to this project, you can do so by

1. Fork this repo
2. Clone the fork to your local machine
3. Do the necessary changes (see [Development](#development) below)
4. Write a meaningful commit message and squash multiple commits
5. Submit your changes and open a new PR by choosing this repository as the upstream

## Development

After you have cloned this repository to your local machine execute the following commands:

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000 (pointing to live api)
$ npm run dev:live
```

Your project will be running at [https://localhost:3000](https://localhost:3000)

You'll need a backend to work with. Currently the backend is not open-source. To speed up the process however,
it's possible to create a proxy and point directly the live API which will allow local development. In order to do
that simply create an `.env` file and specify the following environment variables:

```
PORT=8080
API_DOMAIN=/api
API_PROXY_DOMAIN=http://localhost:8080/
STRIPE_API_KEY=pk_test_BeWmmZ8Sd6tdYHNOtmThjYXm00QZbiTJYt
```

## Open Source

You can check the [LICENSE](/LICENSE) for more information.
