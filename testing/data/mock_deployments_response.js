export default () => ({
  deploys: [
    {
      branch: "master",
      numberOfFiles: 29,
      totalSizeInBytes: 1272640,
      version: "341",
      exit: 0,
      percentage: 100,
      pullRequestNumber: null,
      isAutoDeploy: false,
      createdAt: 1588622630,
      stoppedAt: 1588622786,
      appId: "1",
      id: "10556341488718",
      config: {
        appId: 1,
        autoPublish: true,
        branch: "master",
        build: {
          cmd: "yarn test \u0026\u0026 yarn run build:console",
          distFolder: "packages/console/dist",
          entry: "packages/console/server/renderer.js",
          vars: {
            API_DOMAIN: "https://api.stormkit.io",
            BABEL_ENV: "production",
            NODE_ENV: "production",
            ROOT: "\u003croot\u003e/packages/console",
            STRIPE_API_KEY: "pk_live_pQIxMmRarwRKipTeFcTVW2cF00BcVT5IFj",
          },
        },
        domain: {
          cname: "app-stormkit-io-cnmiji6et.hosting.stormkit.io.",
          name: "app.stormkit.io",
          verified: true,
        },
        env: "production",
      },
      isRunning: false,
      preview: "https://-10556341488718.stormkit.dev",
      logs: [
        {
          message: "Succesfully checked out master",
          payload: {
            branch: "master",
            commit: {
              author: "Foo Bar \u003cfoobar@stormkit.io\u003e",
              message:
                "Improve snippets\n\n- Fix broken functionality\n- Improve edit/delete versions\n- Update state when props change for Switch component",
              sha: "6ebc107493355689a407a4fe2888b3e81529e779",
            },
          },
          status: true,
          title: "checkout master",
        },
        { message: "v12.16.2\n", status: true, title: "node --version" },
        {
          message:
            'yarn config v1.22.4\nsuccess Set "workspaces-experimental" to "true".\nDone in 0.03s.\n',
          status: true,
          title: "enable yarn workspaces",
        },
        {
          message:
            'yarn install v1.22.4\n[1/4] Resolving packages...\n[2/4] Fetching packages...\ninfo fsevents@1.2.12: The platform "linux" is incompatible with this module.\ninfo "fsevents@1.2.12" is an optional dependency and failed compatibility check. Excluding it from installation.\ninfo fsevents@2.1.2: The platform "linux" is incompatible with this module.\ninfo "fsevents@2.1.2" is an optional dependency and failed compatibility check. Excluding it from installation.\n[3/4] Linking dependencies...\n[4/4] Building fresh packages...\nsuccess Saved lockfile.\nDone in 83.86s.\n',
          status: true,
          title: "yarn",
        },
        {
          message:
            "API_DOMAIN=https://api.stormkit.io\nBABEL_ENV=production\nNODE_ENV=production\nROOT=/home/app/repo/packages/console\nSK_APP_ID=1\nSK_CLIENT_ID=MypXlNXuA5xetiQi\nSK_CLIENT_SECRET=m6i8094GiIm-hu6MOAMdzoH4-sgcmpen4lwqjWzTspNnI2UP4Z_onqd3ZOfou4G2L0kCvVEvM8ty4hli\nSTRIPE_API_KEY=pk_live_pQIxMmRarwRKipTeFcTVW2cF00BcVT5IFj\nPUBLIC_PATH=https://cdn.stormkit.io/nwozk3kt/ybyxitlcji/\nPUBLIC_URL=https://cdn.stormkit.io/nwozk3kt/ybyxitlcji/\n",
          status: true,
          title: "environment variables",
        },
        {
          message:
            "yarn run v1.22.4\n$ jest --notify --detectOpenHandles --config=config/jest.config.js\nDone in 5.70s.\n",
          status: true,
          title: "yarn test",
        },
        {
          message:
            'yarn run v1.22.4\n$ node scripts/prod.js --console\nCompiled successfully.\n\nHash: fb1ced74b493da8c91bc\nVersion: webpack 4.42.0\nTime: 26458ms\nBuilt at: 05/04/2020 8:06:10 PM\n                               Asset        Size  Chunks                                Chunk Names\n           0.7bb7329667c4d713a1bd.js     432 KiB       0  [emitted] [immutable]  [big]  \n           1.8ed97b6318b76f7158ec.js    19.8 KiB       1  [emitted] [immutable]         \n          10.b5d57a9ba17ea51ca863.js    1.83 KiB      10  [emitted] [immutable]         \n          11.132c71f24d578146d373.js    25.7 KiB      11  [emitted] [immutable]         \n          12.73c301f316448f88e48c.js  1010 bytes      12  [emitted] [immutable]         \n16a568ca9eb15a225e3a90aee0f68909.svg   484 bytes          [emitted]                     \n1c589be7daab00b335e46d88b760dddb.png    15.8 KiB          [emitted]                     \n           2.30a519b6a98f3c5102c0.js    17.2 KiB       2  [emitted] [immutable]         \n209ae8e9585774eb4fe32c001f7c63cc.svg    1.06 KiB          [emitted]                     \n30f1b1d6bde5f36eb6d0692ba7fce73d.svg    1.79 KiB          [emitted]                     \n           4.410ca1ad303b8fae6868.js    72.5 KiB       4  [emitted] [immutable]         \n4d7bac3b0b9ab578b009c54fecd5d06f.svg   221 bytes          [emitted]                     \n           5.9e517df91636a79fb9dd.js    43.4 KiB       5  [emitted] [immutable]         \n550102323f9e42b9572ac7716857c236.svg   781 bytes          [emitted]                     \n5db9fea0ec9e05cfb98e7387be5d0aa7.svg   541 bytes          [emitted]                     \n           6.adc8307c1704341ffde7.js    23.9 KiB       6  [emitted] [immutable]         \n           7.594819b0afd5e3bc8810.js     146 KiB   7, 10  [emitted] [immutable]         \n           8.838d1268b148da5b604c.js    16.5 KiB       8  [emitted] [immutable]         \n8678fc67f7ebd50a5fc7c12a39ab93a2.svg   708 bytes          [emitted]                     \n8ec583188aba7e9426580350312d97a5.svg    3.83 KiB          [emitted]                     \n           9.f3310f8f4950a2c060e6.js     9.8 KiB       9  [emitted] [immutable]         \n9eb47fe757c9d8abb85049a379b606a0.svg   948 bytes          [emitted]                     \na6ccef1791c2f2c218a3a490798c9c1d.svg   778 bytes          [emitted]                     \na94c93941a4d8907fc2be5a61841c2b9.svg   743 bytes          [emitted]                     \nb039bdb8e50c968b6c50c8110676061f.svg   698 bytes          [emitted]                     \n      client.fb1ced74b493da8c91bc.js     394 KiB       3  [emitted] [immutable]  [big]  main\nef701aba4f5dc68beb3166d7a19c8787.svg    7.51 KiB          [emitted]                     \n                         favicon.png    2.38 KiB          [emitted]                     \n                          index.html   986 bytes          [emitted]                     \nEntrypoint main [big] = client.fb1ced74b493da8c91bc.js\n  [0] ./node_modules/react/index.js 190 bytes {3} [built]\n  [3] ./node_modules/prop-types/index.js 710 bytes {3} [built]\n  [4] ./node_modules/@babel/runtime/helpers/defineProperty.js 289 bytes {3} [built]\n  [6] ./node_modules/@babel/runtime/helpers/esm/extends.js 397 bytes {3} [built]\n  [7] ./node_modules/@babel/runtime/helpers/getPrototypeOf.js 267 bytes {3} [built]\n  [8] ./node_modules/@babel/runtime/helpers/createClass.js 596 bytes {3} [built]\n  [9] ./node_modules/@babel/runtime/helpers/classCallCheck.js 196 bytes {3} [built]\n [10] ./node_modules/@babel/runtime/helpers/assertThisInitialized.js 219 bytes {3} [built]\n [12] ./node_modules/@babel/runtime/helpers/extends.js 427 bytes {3} [built]\n [13] ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js 343 bytes {3} [built]\n [22] ./node_modules/react-dom/index.js 1.33 KiB {3} [built]\n [31] ./node_modules/react-router-dom/esm/react-router-dom.js 9.76 KiB {3} [built]\n [67] ./packages/console/src/RootContext.js + 5 modules 21.1 KiB {3} [built]\n      | ./packages/console/src/RootContext.js 3.42 KiB [built]\n      | ./packages/console/src/api/Api.js 7.75 KiB [built]\n      | ./packages/console/src/api/Bitbucket.js 2.52 KiB [built]\n      | ./packages/console/src/api/Github.js 3.94 KiB [built]\n      | ./packages/console/src/api/Gitlab.js 2.64 KiB [built]\n      | ./packages/console/src/api/helpers.js 733 bytes [built]\n [92] multi ./packages/console/src/index.js 28 bytes {3} [built]\n[109] ./packages/console/src/index.js + 10 modules 18.1 KiB {3} [built]\n      | ./packages/console/src/index.js 339 bytes [built]\n      | ./packages/console/src/Root.js 1.38 KiB [built]\n      | ./packages/console/src/layout/index.js 182 bytes [built]\n      | ./packages/console/src/routes.js 961 bytes [built]\n      | ./packages/console/src/globals.js 424 bytes [built]\n      | ./packages/console/src/layout/Layout.js 1.56 KiB [built]\n      | ./packages/console/src/layout/components/UserMenu/UserMenu.js 2.85 KiB [built]\n      | ./packages/components/Async/index.js 34 bytes [built]\n      | ./packages/ui/globals.js 3.28 KiB [built]\n      | ./packages/console/src/layout/components/UserMenu/UserMenu.styles.js 1.85 KiB [built]\n      | ./packages/components/Async/Async.js 5.11 KiB [built]\n    + 398 hidden modules\n\nWARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).\nThis can impact web performance.\nAssets: \n  0.7bb7329667c4d713a1bd.js (432 KiB)\n  client.fb1ced74b493da8c91bc.js (394 KiB)\n\nWARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.\nEntrypoints:\n  main (394 KiB)\n      client.fb1ced74b493da8c91bc.js\n\nChild html-webpack-plugin for "index.html":\n         Asset     Size  Chunks  Chunk Names\n    index.html  534 KiB       0  \n    Entrypoint undefined = index.html\n    [0] ./node_modules/html-webpack-plugin/lib/loader.js!./packages/console/public/index.html 1.52 KiB {0} [built]\n    [1] ./node_modules/lodash/lodash.js 528 KiB {0} [built]\n    [2] (webpack)/buildin/global.js 472 bytes {0} [built]\n    [3] (webpack)/buildin/module.js 497 bytes {0} [built]\nDone in 27.95s.\n',
          status: true,
          title: "yarn run build:console",
        },
        {
          message:
            "Hash: a3af14622fc3479c39c6\nVersion: webpack 4.42.0\nTime: 11979ms\nBuilt at: 05/04/2020 8:06:23 PM\n                               Asset       Size  Chunks             Chunk Names\n16a568ca9eb15a225e3a90aee0f68909.svg  484 bytes          [emitted]  \n1c589be7daab00b335e46d88b760dddb.png   15.8 KiB          [emitted]  \n209ae8e9585774eb4fe32c001f7c63cc.svg   1.06 KiB          [emitted]  \n30f1b1d6bde5f36eb6d0692ba7fce73d.svg   1.79 KiB          [emitted]  \n4d7bac3b0b9ab578b009c54fecd5d06f.svg  221 bytes          [emitted]  \n550102323f9e42b9572ac7716857c236.svg  781 bytes          [emitted]  \n5db9fea0ec9e05cfb98e7387be5d0aa7.svg  541 bytes          [emitted]  \n8678fc67f7ebd50a5fc7c12a39ab93a2.svg  708 bytes          [emitted]  \n8ec583188aba7e9426580350312d97a5.svg   3.83 KiB          [emitted]  \n9eb47fe757c9d8abb85049a379b606a0.svg  948 bytes          [emitted]  \n                        __sk__app.js   2.68 MiB       0  [emitted]  main\na6ccef1791c2f2c218a3a490798c9c1d.svg  778 bytes          [emitted]  \na94c93941a4d8907fc2be5a61841c2b9.svg  743 bytes          [emitted]  \nb039bdb8e50c968b6c50c8110676061f.svg  698 bytes          [emitted]  \nef701aba4f5dc68beb3166d7a19c8787.svg   7.51 KiB          [emitted]  \n                         favicon.png   2.38 KiB          [emitted]  \n                          index.html  853 bytes          [emitted]  \nEntrypoint main = __sk__app.js\n  [0] /home/app/repo/node_modules/react/index.js 190 bytes {0} [built]\n  [3] /home/app/repo/node_modules/prop-types/index.js 710 bytes {0} [built]\n  [4] /home/app/repo/node_modules/@babel/runtime/helpers/defineProperty.js 289 bytes {0} [built]\n  [5] /home/app/repo/node_modules/@babel/runtime/helpers/esm/extends.js 397 bytes {0} [built]\n [11] /home/app/repo/node_modules/@babel/runtime/helpers/getPrototypeOf.js 267 bytes {0} [built]\n [13] /home/app/repo/node_modules/@babel/runtime/helpers/assertThisInitialized.js 219 bytes {0} [built]\n [15] /home/app/repo/node_modules/@babel/runtime/helpers/extends.js 427 bytes {0} [built]\n [16] /home/app/repo/node_modules/@babel/runtime/helpers/createClass.js 596 bytes {0} [built]\n [17] /home/app/repo/node_modules/@babel/runtime/helpers/classCallCheck.js 196 bytes {0} [built]\n [20] ./src/RootContext.js + 5 modules 21.1 KiB {0} [built]\n      | ./src/RootContext.js 3.42 KiB [built]\n      | ./src/api/Api.js 7.75 KiB [built]\n      | ./src/api/Bitbucket.js 2.52 KiB [built]\n      | ./src/api/Github.js 3.94 KiB [built]\n      | ./src/api/Gitlab.js 2.64 KiB [built]\n      | ./src/api/helpers.js 733 bytes [built]\n [25] /home/app/repo/node_modules/@babel/runtime/regenerator/index.js 49 bytes {0} [built]\n [26] /home/app/repo/node_modules/react-router-dom/esm/react-router-dom.js 9.76 KiB {0} [built]\n [32] /home/app/repo/node_modules/@babel/runtime/helpers/asyncToGenerator.js 809 bytes {0} [built]\n[242] /home/app/repo/node_modules/react-dom/server.js 58 bytes {0} [built]\n[294] ./server/renderer.js + 10 modules 19.5 KiB {0} [built]\n      | ./server/renderer.js 1.77 KiB [built]\n      | ./src/Root.js 1.38 KiB [built]\n      | ./src/layout/index.js 182 bytes [built]\n      | ./src/routes.js 961 bytes [built]\n      | ./src/globals.js 424 bytes [built]\n      | ./src/layout/Layout.js 1.56 KiB [built]\n      | ./src/layout/components/UserMenu/UserMenu.js 2.85 KiB [built]\n      | ../components/Async/index.js 34 bytes [built]\n      | ../ui/globals.js 3.28 KiB [built]\n      | ./src/layout/components/UserMenu/UserMenu.styles.js 1.85 KiB [built]\n      | ../components/Async/Async.js 5.11 KiB [built]\n    + 389 hidden modules\n",
          status: true,
          title: "building server side",
        },
        {
          exit: 0,
          message:
            "Successfully deployed client side.\nTotal files uploaded: 29\nTotal bytes uploaded: 1.3MB\nSuccessfully deployed server side.\nPackage size: 586.0kB\nNew function version: 341\n",
          status: true,
          title: "deploy",
        },
      ],
      tip: null,
      published: [{ envId: "1429333243019", percentage: 100 }],
    },
    {
      branch: "master",
      numberOfFiles: 29,
      totalSizeInBytes: 1272457,
      version: "340",
      exit: null,
      percentage: 0,
      pullRequestNumber: null,
      isAutoDeploy: false,
      createdAt: 1588617461,
      stoppedAt: 1588617607,
      appId: "1",
      id: "10554696686367",
      config: {
        appId: 1,
        autoPublish: true,
        branch: "master",
        build: {
          cmd: "yarn test \u0026\u0026 yarn run build:console",
          distFolder: "packages/console/dist",
          entry: "packages/console/server/renderer.js",
          vars: {
            API_DOMAIN: "https://api.stormkit.io",
            BABEL_ENV: "production",
            NODE_ENV: "production",
            ROOT: "\u003croot\u003e/packages/console",
            STRIPE_API_KEY: "pk_live_pQIxMmRarwRKipTeFcTVW2cF00BcVT5IFj",
          },
        },
        domain: {
          cname: "app-stormkit-io-cnmiji6et.hosting.stormkit.io.",
          name: "app.stormkit.io",
          verified: true,
        },
        env: "production",
      },
      isRunning: true,
      preview: "https://-10554696686367.stormkit.dev",
      logs: [
        {
          message: "Succesfully checked out master",
          payload: {
            branch: "master",
            commit: {
              author: "Foo Bar \u003cfoobar@stormkit.io\u003e",
              message: "Fix inject type",
              sha: "a577d3dc4b2111caabefe74c5c0ceb2b02dff4de",
            },
          },
          status: true,
          title: "checkout master",
        },
        { message: "v12.16.2\n", status: true, title: "node --version" },
        {
          message:
            'yarn config v1.22.4\nsuccess Set "workspaces-experimental" to "true".\nDone in 0.03s.\n',
          status: true,
          title: "enable yarn workspaces",
        },
        {
          message:
            'yarn install v1.22.4\n[1/4] Resolving packages...\n[2/4] Fetching packages...\ninfo fsevents@1.2.12: The platform "linux" is incompatible with this module.\ninfo "fsevents@1.2.12" is an optional dependency and failed compatibility check. Excluding it from installation.\ninfo fsevents@2.1.2: The platform "linux" is incompatible with this module.\ninfo "fsevents@2.1.2" is an optional dependency and failed compatibility check. Excluding it from installation.\n[3/4] Linking dependencies...\n[4/4] Building fresh packages...\nsuccess Saved lockfile.\nDone in 82.38s.\n',
          status: true,
          title: "yarn",
        },
        {
          message:
            "API_DOMAIN=https://api.stormkit.io\nBABEL_ENV=production\nNODE_ENV=production\nROOT=/home/app/repo/packages/console\nSK_APP_ID=1\nSK_CLIENT_ID=MypXlNXuA5xetiQi\nSK_CLIENT_SECRET=m6i8094GiIm-hu6MOAMdzoH4-sgcmpen4lwqjWzTspNnI2UP4Z_onqd3ZOfou4G2L0kCvVEvM8ty4hli\nSTRIPE_API_KEY=pk_live_pQIxMmRarwRKipTeFcTVW2cF00BcVT5IFj\nPUBLIC_PATH=https://cdn.stormkit.io/nwozk3kt/4d9lyatkzq/\nPUBLIC_URL=https://cdn.stormkit.io/nwozk3kt/4d9lyatkzq/\n",
          status: true,
          title: "environment variables",
        },
        {
          message:
            "yarn run v1.22.4\n$ jest --notify --detectOpenHandles --config=config/jest.config.js\nDone in 5.69s.\n",
          status: true,
          title: "yarn test",
        },
        {
          message:
            'yarn run v1.22.4\n$ node scripts/prod.js --console\nCompiled successfully.\n\nHash: 3451ad4d70ddf0fcda86\nVersion: webpack 4.42.0\nTime: 26359ms\nBuilt at: 05/04/2020 6:39:50 PM\n                               Asset        Size  Chunks                                Chunk Names\n           0.7bb7329667c4d713a1bd.js     432 KiB       0  [emitted] [immutable]  [big]  \n           1.8ed97b6318b76f7158ec.js    19.8 KiB       1  [emitted] [immutable]         \n          10.b5d57a9ba17ea51ca863.js    1.83 KiB      10  [emitted] [immutable]         \n          11.132c71f24d578146d373.js    25.7 KiB      11  [emitted] [immutable]         \n          12.73c301f316448f88e48c.js  1010 bytes      12  [emitted] [immutable]         \n16a568ca9eb15a225e3a90aee0f68909.svg   484 bytes          [emitted]                     \n1c589be7daab00b335e46d88b760dddb.png    15.8 KiB          [emitted]                     \n           2.30a519b6a98f3c5102c0.js    17.2 KiB       2  [emitted] [immutable]         \n209ae8e9585774eb4fe32c001f7c63cc.svg    1.06 KiB          [emitted]                     \n30f1b1d6bde5f36eb6d0692ba7fce73d.svg    1.79 KiB          [emitted]                     \n           4.410ca1ad303b8fae6868.js    72.5 KiB       4  [emitted] [immutable]         \n4d7bac3b0b9ab578b009c54fecd5d06f.svg   221 bytes          [emitted]                     \n           5.9e517df91636a79fb9dd.js    43.4 KiB       5  [emitted] [immutable]         \n550102323f9e42b9572ac7716857c236.svg   781 bytes          [emitted]                     \n5db9fea0ec9e05cfb98e7387be5d0aa7.svg   541 bytes          [emitted]                     \n           6.adc8307c1704341ffde7.js    23.9 KiB       6  [emitted] [immutable]         \n           7.59208df618e1d603c687.js     146 KiB   7, 10  [emitted] [immutable]         \n           8.838d1268b148da5b604c.js    16.5 KiB       8  [emitted] [immutable]         \n8678fc67f7ebd50a5fc7c12a39ab93a2.svg   708 bytes          [emitted]                     \n8ec583188aba7e9426580350312d97a5.svg    3.83 KiB          [emitted]                     \n           9.f3310f8f4950a2c060e6.js     9.8 KiB       9  [emitted] [immutable]         \n9eb47fe757c9d8abb85049a379b606a0.svg   948 bytes          [emitted]                     \na6ccef1791c2f2c218a3a490798c9c1d.svg   778 bytes          [emitted]                     \na94c93941a4d8907fc2be5a61841c2b9.svg   743 bytes          [emitted]                     \nb039bdb8e50c968b6c50c8110676061f.svg   698 bytes          [emitted]                     \n      client.3451ad4d70ddf0fcda86.js     394 KiB       3  [emitted] [immutable]  [big]  main\nef701aba4f5dc68beb3166d7a19c8787.svg    7.51 KiB          [emitted]                     \n                         favicon.png    2.38 KiB          [emitted]                     \n                          index.html   986 bytes          [emitted]                     \nEntrypoint main [big] = client.3451ad4d70ddf0fcda86.js\n  [0] ./node_modules/react/index.js 190 bytes {3} [built]\n  [3] ./node_modules/prop-types/index.js 710 bytes {3} [built]\n  [4] ./node_modules/@babel/runtime/helpers/defineProperty.js 289 bytes {3} [built]\n  [6] ./node_modules/@babel/runtime/helpers/esm/extends.js 397 bytes {3} [built]\n  [7] ./node_modules/@babel/runtime/helpers/getPrototypeOf.js 267 bytes {3} [built]\n  [8] ./node_modules/@babel/runtime/helpers/createClass.js 596 bytes {3} [built]\n  [9] ./node_modules/@babel/runtime/helpers/classCallCheck.js 196 bytes {3} [built]\n [10] ./node_modules/@babel/runtime/helpers/assertThisInitialized.js 219 bytes {3} [built]\n [12] ./node_modules/@babel/runtime/helpers/extends.js 427 bytes {3} [built]\n [13] ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js 343 bytes {3} [built]\n [22] ./node_modules/react-dom/index.js 1.33 KiB {3} [built]\n [31] ./node_modules/react-router-dom/esm/react-router-dom.js 9.76 KiB {3} [built]\n [67] ./packages/console/src/RootContext.js + 5 modules 21.1 KiB {3} [built]\n      | ./packages/console/src/RootContext.js 3.42 KiB [built]\n      | ./packages/console/src/api/Api.js 7.75 KiB [built]\n      | ./packages/console/src/api/Bitbucket.js 2.52 KiB [built]\n      | ./packages/console/src/api/Github.js 3.94 KiB [built]\n      | ./packages/console/src/api/Gitlab.js 2.64 KiB [built]\n      | ./packages/console/src/api/helpers.js 733 bytes [built]\n [92] multi ./packages/console/src/index.js 28 bytes {3} [built]\n[109] ./packages/console/src/index.js + 10 modules 18.1 KiB {3} [built]\n      | ./packages/console/src/index.js 339 bytes [built]\n      | ./packages/console/src/Root.js 1.38 KiB [built]\n      | ./packages/console/src/layout/index.js 182 bytes [built]\n      | ./packages/console/src/routes.js 961 bytes [built]\n      | ./packages/console/src/globals.js 424 bytes [built]\n      | ./packages/console/src/layout/Layout.js 1.56 KiB [built]\n      | ./packages/console/src/layout/components/UserMenu/UserMenu.js 2.85 KiB [built]\n      | ./packages/components/Async/index.js 34 bytes [built]\n      | ./packages/ui/globals.js 3.28 KiB [built]\n      | ./packages/console/src/layout/components/UserMenu/UserMenu.styles.js 1.85 KiB [built]\n      | ./packages/components/Async/Async.js 5.11 KiB [built]\n    + 398 hidden modules\n\nWARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).\nThis can impact web performance.\nAssets: \n  0.7bb7329667c4d713a1bd.js (432 KiB)\n  client.3451ad4d70ddf0fcda86.js (394 KiB)\n\nWARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.\nEntrypoints:\n  main (394 KiB)\n      client.3451ad4d70ddf0fcda86.js\n\nChild html-webpack-plugin for "index.html":\n         Asset     Size  Chunks  Chunk Names\n    index.html  534 KiB       0  \n    Entrypoint undefined = index.html\n    [0] ./node_modules/html-webpack-plugin/lib/loader.js!./packages/console/public/index.html 1.52 KiB {0} [built]\n    [1] ./node_modules/lodash/lodash.js 528 KiB {0} [built]\n    [2] (webpack)/buildin/global.js 472 bytes {0} [built]\n    [3] (webpack)/buildin/module.js 497 bytes {0} [built]\nDone in 27.85s.\n',
          status: true,
          title: "yarn run build:console",
        },
        {
          message:
            "Hash: 2db4c0e609f462efaa8e\nVersion: webpack 4.42.0\nTime: 12230ms\nBuilt at: 05/04/2020 6:40:03 PM\n                               Asset       Size  Chunks             Chunk Names\n16a568ca9eb15a225e3a90aee0f68909.svg  484 bytes          [emitted]  \n1c589be7daab00b335e46d88b760dddb.png   15.8 KiB          [emitted]  \n209ae8e9585774eb4fe32c001f7c63cc.svg   1.06 KiB          [emitted]  \n30f1b1d6bde5f36eb6d0692ba7fce73d.svg   1.79 KiB          [emitted]  \n4d7bac3b0b9ab578b009c54fecd5d06f.svg  221 bytes          [emitted]  \n550102323f9e42b9572ac7716857c236.svg  781 bytes          [emitted]  \n5db9fea0ec9e05cfb98e7387be5d0aa7.svg  541 bytes          [emitted]  \n8678fc67f7ebd50a5fc7c12a39ab93a2.svg  708 bytes          [emitted]  \n8ec583188aba7e9426580350312d97a5.svg   3.83 KiB          [emitted]  \n9eb47fe757c9d8abb85049a379b606a0.svg  948 bytes          [emitted]  \n                        __sk__app.js   2.68 MiB       0  [emitted]  main\na6ccef1791c2f2c218a3a490798c9c1d.svg  778 bytes          [emitted]  \na94c93941a4d8907fc2be5a61841c2b9.svg  743 bytes          [emitted]  \nb039bdb8e50c968b6c50c8110676061f.svg  698 bytes          [emitted]  \nef701aba4f5dc68beb3166d7a19c8787.svg   7.51 KiB          [emitted]  \n                         favicon.png   2.38 KiB          [emitted]  \n                          index.html  853 bytes          [emitted]  \nEntrypoint main = __sk__app.js\n  [0] /home/app/repo/node_modules/react/index.js 190 bytes {0} [built]\n  [3] /home/app/repo/node_modules/prop-types/index.js 710 bytes {0} [built]\n  [4] /home/app/repo/node_modules/@babel/runtime/helpers/defineProperty.js 289 bytes {0} [built]\n  [5] /home/app/repo/node_modules/@babel/runtime/helpers/esm/extends.js 397 bytes {0} [built]\n [11] /home/app/repo/node_modules/@babel/runtime/helpers/getPrototypeOf.js 267 bytes {0} [built]\n [13] /home/app/repo/node_modules/@babel/runtime/helpers/assertThisInitialized.js 219 bytes {0} [built]\n [15] /home/app/repo/node_modules/@babel/runtime/helpers/extends.js 427 bytes {0} [built]\n [16] /home/app/repo/node_modules/@babel/runtime/helpers/createClass.js 596 bytes {0} [built]\n [17] /home/app/repo/node_modules/@babel/runtime/helpers/classCallCheck.js 196 bytes {0} [built]\n [20] ./src/RootContext.js + 5 modules 21.1 KiB {0} [built]\n      | ./src/RootContext.js 3.42 KiB [built]\n      | ./src/api/Api.js 7.75 KiB [built]\n      | ./src/api/Bitbucket.js 2.52 KiB [built]\n      | ./src/api/Github.js 3.94 KiB [built]\n      | ./src/api/Gitlab.js 2.64 KiB [built]\n      | ./src/api/helpers.js 733 bytes [built]\n [25] /home/app/repo/node_modules/@babel/runtime/regenerator/index.js 49 bytes {0} [built]\n [26] /home/app/repo/node_modules/react-router-dom/esm/react-router-dom.js 9.76 KiB {0} [built]\n [32] /home/app/repo/node_modules/@babel/runtime/helpers/asyncToGenerator.js 809 bytes {0} [built]\n[242] /home/app/repo/node_modules/react-dom/server.js 58 bytes {0} [built]\n[294] ./server/renderer.js + 10 modules 19.5 KiB {0} [built]\n      | ./server/renderer.js 1.77 KiB [built]\n      | ./src/Root.js 1.38 KiB [built]\n      | ./src/layout/index.js 182 bytes [built]\n      | ./src/routes.js 961 bytes [built]\n      | ./src/globals.js 424 bytes [built]\n      | ./src/layout/Layout.js 1.56 KiB [built]\n      | ./src/layout/components/UserMenu/UserMenu.js 2.85 KiB [built]\n      | ../components/Async/index.js 34 bytes [built]\n      | ../ui/globals.js 3.28 KiB [built]\n      | ./src/layout/components/UserMenu/UserMenu.styles.js 1.85 KiB [built]\n      | ../components/Async/Async.js 5.11 KiB [built]\n    + 389 hidden modules\n",
          status: true,
          title: "building server side",
        },
        {
          exit: 0,
          message:
            "Successfully deployed client side.\nTotal files uploaded: 29\nTotal bytes uploaded: 1.3MB\nSuccessfully deployed server side.\nPackage size: 586.0kB\nNew function version: 340\n",
          status: true,
          title: "deploy",
        },
      ],
      tip: null,
      published: [],
    },
    {
      branch: "master",
      numberOfFiles: 0,
      totalSizeInBytes: 0,
      exit: -1,
      percentage: 0,
      pullRequestNumber: null,
      isAutoDeploy: false,
      createdAt: 1588613461,
      stoppedAt: 1588613607,
      appId: "1",
      id: "10554396586367",
      config: {
        appId: 1,
        autoPublish: true,
        branch: "master",
        build: {
          cmd: "yarn test \u0026\u0026 yarn run build:console",
          distFolder: "packages/console/dist",
          entry: "packages/console/server/renderer.js",
          vars: {
            API_DOMAIN: "https://api.stormkit.io",
            BABEL_ENV: "production",
            NODE_ENV: "production",
            ROOT: "\u003croot\u003e/packages/console",
            STRIPE_API_KEY: "pk_live_pQIxMmRarwRKipTeFcTVW2cF00BcVT5IFj",
          },
        },
        domain: {
          cname: "app-stormkit-io-cnmiji6et.hosting.stormkit.io.",
          name: "app.stormkit.io",
          verified: true,
        },
        env: "production",
      },
      isRunning: false,
      preview: "https://-10554696686367.stormkit.dev",
      logs: [
        {
          message:
            "Succesfully checked out master\nThis deployment has been stopped manually",
          payload: {
            branch: "master",
            commit: {
              author: "Foo Bar \u003cfoobar@stormkit.io\u003e",
              message: "My stopped deployment",
              sha: "a577d3dc4b2111caabefe74c5c0ceb2b02dff4de",
            },
          },
          status: false,
          title: "checkout master",
        },
      ],
      tip: null,
      published: [],
    },
  ],
  hasNextPage: true,
});
