import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from 'src/schema/schema';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'https://www.cheapshark.com/api/1.0';

  constructor(private http: HttpClient) { }

  getGames(searchTerm: string) {
    return this.http.get<Game[]>(`${this.apiUrl}/games?title=${searchTerm}`);
  }
}
