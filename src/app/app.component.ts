import { GameService } from './game.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, forkJoin } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { StoreInfo } from 'src/schema/schema';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `<div class="search">
      <input
        type="text"
        placeholder="Search game"
        id="game-search-input"
        #gameSearch
      />
    </div>
    <div id="game-list-container">
      <p *ngIf="gameDeals.length <= 0" id="game-list-empty">
        There are no games to display.
      </p>
      <div *ngIf="isLoading" id="spinner">
        <span class="spinner-inner-1"></span>
        <span class="spinner-inner-2"></span>
        <span class="spinner-inner-3"></span>
      </div>
      <ul id="game-list">
        <li *ngFor="let game of gameDeals">
          <p>{{ game.name }}</p>
          <img class="game-thumbnail" src="{{ game.thumb }}" />
          <p>Retail price {{ game.retailPrice | currency:'USD' }}</p>
          <p>Sale price {{ game.salePrice | currency:'USD' }}</p>
          <p>Store: {{ getStore(game.storeID) }}</p>
          <div></div>
        </li>
      </ul>
    </div>`,
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('gameSearch') gameSearchInput!: ElementRef<HTMLInputElement>;

  stores: StoreInfo[] = [];
  gameDeals: GameDeal[] = [];
  deal: any = null;
  isLoading: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService
      .getStores()
      .pipe(map((stores) => stores.filter((store) => store.isActive!!)))
      .subscribe((stores) => (this.stores = stores));
  }

  ngAfterViewInit(): void {
    fromEvent(this.gameSearchInput.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((event) =>
          this.gameService
            .getGames((event.target as HTMLInputElement).value)
            .pipe(
              tap(() => {
                this.isLoading = false;
              }),
              map((games) =>
                games.map((game) =>
                  this.gameService.getDeal(game.cheapestDealID).pipe(
                    map((deal) => {
                      const { name, retailPrice, salePrice, storeID, thumb } =
                        deal.gameInfo;
                      return {
                        name,
                        retailPrice,
                        salePrice,
                        storeID,
                        thumb,
                      } as GameDeal;
                    })
                  )
                )
              )
            ),
        ),
        mergeMap(gameDeals => forkJoin(gameDeals))
      )
      .subscribe((gameDeals) => {
        this.gameDeals = gameDeals;
      });
  }

  getStore(storeID: number): string {
    const store = this.stores.find((s) => s.storeID === storeID);
    if (store) {
      return store.storeName;
    }
    return 'This store is not available :(';
  }
}

interface GameDeal {
    name: string;
    retailPrice: number;
    salePrice: number;
    storeID: number;
    thumb: string;
}