export default () => ({
  deploy: {
    branch: "",
    numberOfFiles: 25,
    totalSizeInBytes: 682871,
    version: null,
    exit: 0,
    percentage: 100,
    pullRequestNumber: null,
    isAutoDeploy: false,
    createdAt: 1594810261,
    stoppedAt: 1594810347,
    appId: "1470453301794",
    id: "14387086164197",
    config: {
      appId: "1470453301794",
      autoPublish: true,
      branch: "master",
      build: {
        cmd: "npm run build",
        distFolder: "dist",
        entry: "",
        vars: {
          API_DOMAIN: "https://api.stormkit.io",
          ENV: "production",
          NODE_ENV: "production",
        },
      },
      domain: { verified: false },
      env: "production",
      id: "1674408793318",
    },
    isRunning: false,
    preview: "https://beta-14387086164197.stormkit.dev",
    logs: [
      {
        message: "Succesfully checked out master",
        payload: {
          branch: "master",
          commit: {
            author: "Savas Vedova \u003csavas@stormkit.io\u003e",
            message: "Add unit tests for domain",
            sha: "4964d9503c98041c8a557a921715e3d96da35c38",
          },
        },
        status: true,
        title: "checkout master",
      },
      { message: "v12.16.2\n", status: true, title: "node --version" },
      {
        message:
          "registry: https://registry.npmjs.org/\n\n\u003e husky@1.3.1 install /home/app/repo/node_modules/husky\n\u003e node husky install\n\nhusky \u003e setting up git hooks\nCI detected, skipping Git hooks installation.\n\n\u003e core-js@2.6.11 postinstall /home/app/repo/node_modules/core-js\n\u003e node -e \"try{require('./postinstall')}catch(e){}\"\n\n\n\u003e core-js-pure@3.6.5 postinstall /home/app/repo/node_modules/core-js-pure\n\u003e node -e \"try{require('./postinstall')}catch(e){}\"\n\n\n\u003e styled-components@4.2.0 postinstall /home/app/repo/node_modules/styled-components\n\u003e node ./scripts/postinstall.js || exit 0\n\nUse styled-components at work? Consider supporting our development efforts at https://opencollective.com/styled-components\nadded 1799 packages from 751 contributors and audited 1807 packages in 33.63s\n\n60 packages are looking for funding\n  run `npm fund` for details\n\nfound 4562 low severity vulnerabilities\n  run `npm audit fix` to fix them, or `npm audit` for details\n",
        status: true,
        title: "npm i",
      },
      {
        message:
          "API_DOMAIN=https://api.stormkit.io\nENV=production\nNODE_ENV=production\nSK_APP_ID=1470453301794\nSK_CLIENT_ID=bI4iBkSGo1J7NzoH\nSK_CLIENT_SECRET=wvR6b5v9uSaqJrgYHYdMPHsEWP8b8LAv3bDQOv-8seuglow0mcRsID154xJ3WgMdDJZRia05-WnReMLc\nPUBLIC_PATH=https://cdn.stormkit.io/hsrrwxxr/cq1aatr29q/\nPUBLIC_URL=https://cdn.stormkit.io/hsrrwxxr/cq1aatr29q/\n",
        status: true,
        title: "environment variables",
      },
      {
        message:
          '\n\u003e app.stormkit.io@1.0.0 build /home/app/repo\n\u003e webpack --mode production --config config/webpack.config.js\n\nHash: b9b5170dd1b06173ddfc\nVersion: webpack 4.43.0\nTime: 24244ms\nBuilt at: 07/15/2020 10:52:24 AM\n                                     Asset       Size  Chunks                                Chunk Names\n                 1.3cdf995b33b2c112812a.js     19 KiB       1  [emitted] [immutable]         \n                10.5485a2f45012503937fa.js   9.65 KiB      10  [emitted] [immutable]         \n                11.e5104f75b52d58743a3c.js   17.9 KiB      11  [emitted] [immutable]         \n                12.a3096d6d7dd77dee7a74.js   16.3 KiB      12  [emitted] [immutable]         \n                13.2c396e1e1db463341161.js   14.5 KiB      13  [emitted] [immutable]         \n                14.ee62d0cb31a52d3153f3.js  318 bytes      14  [emitted] [immutable]         \n                15.8cb9b3807ff090d088c0.js   2.13 KiB      15  [emitted] [immutable]         \n                16.dd655f9261351cb198f3.js  929 bytes      16  [emitted] [immutable]         \n                17.1bbf3f9e552286e1a824.js  334 bytes      17  [emitted] [immutable]         \n                18.3858fdce3ad8ce8ec46b.js  354 bytes      18  [emitted] [immutable]         \n                 3.5073d8684ca378a9dc28.js   26.6 KiB       3  [emitted] [immutable]         \n                 4.e706823b91e9af77dab0.js     20 KiB       4  [emitted] [immutable]         \n                 5.b970db6da4e0259f6d3e.js   19.3 KiB       5  [emitted] [immutable]         \n                 6.e7884c39210d9b29b439.js   41.6 KiB       6  [emitted] [immutable]         \n     6.e7884c39210d9b29b439.js.LICENSE.txt   1.23 KiB          [emitted]                     \n                 7.ce1b69ac89128bce5383.js   16.9 KiB       7  [emitted] [immutable]         \n                 8.12d62e0c1db9a652350c.js   11.8 KiB       8  [emitted] [immutable]         \n                 9.c019d231328de01b2412.js   23.4 KiB       9  [emitted] [immutable]         \n            client.b9b5170dd1b06173ddfc.js    399 KiB       2  [emitted] [immutable]  [big]  main\nclient.b9b5170dd1b06173ddfc.js.LICENSE.txt    1.3 KiB          [emitted]                     \n      e7eb8f027d1518ac02585b5d7dbb5851.svg  851 bytes          [emitted]                     \n                               favicon.png   2.38 KiB          [emitted]                     \n                                index.html   1.43 KiB          [emitted]                     \n            styles.42c4cb73316d05ce78d7.js  257 bytes       0  [emitted] [immutable]         styles\n                                styles.css   19.3 KiB       0  [emitted]                     styles\nEntrypoint main [big] = styles.css styles.42c4cb73316d05ce78d7.js client.b9b5170dd1b06173ddfc.js\n  [6] ./node_modules/@material-ui/core/esm/styles/withStyles.js + 6 modules 15.5 KiB {2} [built]\n      |    7 modules\n [23] ./src/utils/api/helpers.js 733 bytes {2} [built]\n [32] ./node_modules/history/esm/history.js + 2 modules 30.6 KiB {2} [built]\n      |    3 modules\n [37] ./src/components/Async/index.js + 1 modules 5.38 KiB {2} [built]\n      |    2 modules\n [39] ./src/components/Spinner/index.js + 1 modules 1.38 KiB {2} [built]\n      |    2 modules\n [44] ./src/utils/storage/index.js + 2 modules 4.53 KiB {2} [built]\n      | ./src/utils/storage/index.js 119 bytes [built]\n      | ./src/utils/storage/SessionStorage.js 2.45 KiB [built]\n      | ./src/utils/storage/LocalStorage.js 1.96 KiB [built]\n [70] ./src/pages/Root.context.js + 1 modules 11.1 KiB {2} [built]\n      | ./src/pages/Root.context.js 3.23 KiB [built]\n      | ./src/utils/api/Api.js 7.75 KiB [built]\n [79] ./src/utils/api/Bitbucket.js 2.54 KiB {2} [built]\n [80] ./src/utils/api/Github.js 3.96 KiB {2} [built]\n [81] ./src/utils/api/Gitlab.js 2.66 KiB {2} [built]\n [85] ./src/pages/auth/index.js + 3 modules 4.58 KiB {2} [built]\n      | ./src/pages/auth/index.js 90 bytes [built]\n      | ./src/pages/auth/auth.js 2.7 KiB [built]\n      | ./src/layouts/CenterLayout.js 427 bytes [built]\n      | ./src/pages/auth/_components/OauthLogin.js 1.32 KiB [built]\n [94] multi ./src/index.js 28 bytes {2} [built]\n [99] ./src/assets/styles/tailwind.css 39 bytes {0} [built]\n[100] ./src/assets/styles/global.css 39 bytes {0} [built]\n[120] ./src/index.js + 2 modules 2.36 KiB {2} [built]\n      | ./src/index.js 480 bytes [built]\n      | ./src/pages/Root.js 918 bytes [built]\n      | ./src/pages/routes.js 961 bytes [built]\n    + 270 hidden modules\n\nWARNING in chunk styles [mini-css-extract-plugin]\nConflicting order. Following module has been added:\n * css ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??postcss!./src/components/ExplanationBox/ExplanationBox.css\ndespite it was not able to fulfill desired ordering with these modules:\n * css ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??postcss!./src/components/Buttons/BackButton.css\n   - couldn\'t fulfill desired order of chunk group(s) \n\nWARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).\nThis can impact web performance.\nAssets: \n  client.b9b5170dd1b06173ddfc.js (399 KiB)\n\nWARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.\nEntrypoints:\n  main (419 KiB)\n      styles.css\n      styles.42c4cb73316d05ce78d7.js\n      client.b9b5170dd1b06173ddfc.js\n\nChild html-webpack-plugin for "index.html":\n     1 asset\n    Entrypoint undefined = index.html\n    [0] ./node_modules/html-webpack-plugin/lib/loader.js!./src/public/index.html 1.52 KiB {0} [built]\n    [2] (webpack)/buildin/global.js 472 bytes {0} [built]\n    [3] (webpack)/buildin/module.js 497 bytes {0} [built]\n        + 1 hidden module\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/assets/styles/global.css:\n    Entrypoint mini-css-extract-plugin = *\n    [0] ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??postcss!./src/assets/styles/global.css 1.49 KiB {0} [built]\n        + 1 hidden module\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/assets/styles/tailwind.css:\n    Entrypoint mini-css-extract-plugin = *\n    [0] ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??postcss!./src/assets/styles/tailwind.css 30.4 KiB {0} [built]\n        + 1 hidden module\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/components/Button/Button.css:\n    Entrypoint mini-css-extract-plugin = *\n       2 modules\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/components/Buttons/BackButton.css:\n    Entrypoint mini-css-extract-plugin = *\n       2 modules\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/components/ExplanationBox/ExplanationBox.css:\n    Entrypoint mini-css-extract-plugin = *\n       2 modules\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/components/InfoBox/InfoBox.css:\n    Entrypoint mini-css-extract-plugin = *\n       2 modules\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/components/Modal/Modal.css:\n    Entrypoint mini-css-extract-plugin = *\n       2 modules\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/components/Spinner/Spinner.css:\n    Entrypoint mini-css-extract-plugin = *\n       2 modules\nChild mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js??postcss!src/pages/auth/Auth.css:\n    Entrypoint mini-css-extract-plugin = *\n    [0] ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??postcss!./src/pages/auth/Auth.css 336 bytes {0} [built]\n        + 1 hidden module\n',
        status: true,
        title: "npm run build",
      },
      {
        exit: 0,
        message:
          "Successfully deployed client side.\nTotal files uploaded: 25\nTotal bytes uploaded: 682.9kB\n",
        status: true,
        title: "deploy",
      },
    ],
    tip: null,
    published: [],
  },
});
