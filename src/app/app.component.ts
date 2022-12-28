import { GameService } from './game.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Game } from 'src/schema/schema';

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
      <p *ngIf="games.length <= 0" id="game-list-empty">There are no games to display.</p>
      <div *ngIf="isLoading" id="spinner">
        <span class="spinner-inner-1"></span>
        <span class="spinner-inner-2"></span>
        <span class="spinner-inner-3"></span>
      </div>
      <ul id="game-list">
        <li *ngFor="let game of games">
          <p>{{ game.external }}</p>
          <img class="game-thumbnail" src={{game.thumb}} />
          <p>{{ game.cheapestDealID }}</p>
        </li>
      </ul>
    </div>`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('gameSearch') gameSearchInput!: ElementRef<HTMLInputElement>;

  games: Game[] = [];
  isLoading: boolean = false;

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
    fromEvent(this.gameSearchInput.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((event) =>
          this.gameService.getGames((event.target as HTMLInputElement).value).pipe(
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
}
