# GameDeal

Game deals page for searching for the best deals for games. The project is made with Angular and uses RxJS to process API requests from the
[CheapShark API](https://apidocs.cheapshark.com/). You can search in the box on the top of the page while RxJS will process your input and send requests as you type. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.6.

## Installation and setup

First, you need to install [yarn](https://yarnpkg.com/) globally on your machine.

Run `yarn install` to install the dependencies.

Then you can run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Ideas

- the main app component could be divided into separate components such as game and deal components
- the first idea was to send multiple requests for each game to immediately show prices using mergeMap and forkJoin from RxJS, however there was a problem with too many requests after some attempts (you can check out the alternative approach on branch *feat/alternative-deals*)
