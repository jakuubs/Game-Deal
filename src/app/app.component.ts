import { GameService } from './game.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Game, StoreInfo } from 'src/schema/schema';

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
      <p *ngIf="games.length <= 0" id="game-list-empty">
        There are no games to display.
      </p>
      <div *ngIf="isLoading" id="spinner">
        <span class="spinner-inner-1"></span>
        <span class="spinner-inner-2"></span>
        <span class="spinner-inner-3"></span>
      </div>
      <ul id="game-list">
        <li *ngFor="let game of games">
          <p>{{ game.external }}</p>
          <img class="game-thumbnail" src="{{ game.thumb }}" />
          <button (click)="getDeal(game.cheapestDealID)">Show deal</button>
          <div *ngIf="deal && shouldShowDeal(game.gameID)">
            <p>Retail price: {{ deal.retailPrice | currency:'USD' }}</p>
            <p>Sale price: {{ deal.salePrice | currency:'USD' }}</p>
            <p>Store: {{ getStore(deal.storeID) }}</p>
          </div>
          <div></div>
        </li>
      </ul>
    </div>`,
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('gameSearch') gameSearchInput!: ElementRef<HTMLInputElement>;

  stores: StoreInfo[] = [];
  games: Game[] = [];
  deal: any = null;
  isLoading: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService
      .getStores()
      .pipe(map((stores) => stores.filter((store) => store.isActive!!))).subscribe(stores => this.stores = stores);
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
              })
            )
        )
      )
      .subscribe((games) => {
        this.games = games;
      });
  }

  getDeal(cheapestDealID: string): void {
    this.gameService
      .getDeal(cheapestDealID)
      .pipe(catchError((error, caught) => of(null)))
      .subscribe((deal) => {
        if (deal) {
          const { gameID, retailPrice, salePrice, storeID } = deal.gameInfo;
          this.deal = {
            gameID,
            retailPrice,
            salePrice,
            storeID,
          };
        }
      });
  }

  shouldShowDeal(gameID: number): boolean {
    if (this.deal.gameID === gameID) {
      return true;
    }
    return false;
  }

  getStore(storeID: number): string {
    const store = this.stores.find(s => s.storeID === storeID);
    if (store) {
      return store.storeName;
    }
    return 'This store is not available :(';
  }
}
