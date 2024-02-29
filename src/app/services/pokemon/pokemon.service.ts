import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from 'src/app/interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  url = 'https://pokeapi.co/api/v2/pokemon?';
  limit = 10;
  offset = 0;
  total = 205;
  totalPages = 0;

  private pokemonsSubject = new BehaviorSubject<Pokemon[]>([]);
  pokemons$ = this.pokemonsSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('PokemonService');
    this.getAllPokemons().subscribe(() => { });
    this.totalPages = Math.ceil(this.total / this.limit);
  }

  getAllPokemons() {
    if (this.offset + this.limit > this.total) {
      this.limit = this.total - this.offset;
      console.log('limit', this.limit);
      this.offset = this.total - this.limit;
      console.log('offset', this.offset);
    } else {
      this.limit = 10;
    }
    const url = this.url + "offset=" + this.offset + "&" + "limit=" + this.limit;
    console.log('url', url);
    return this.http.get(url).pipe(
      map((data: any) => {
        data.results.forEach((pokemon: any, index: number) => {
          pokemon.id = index + 1 + this.offset;
          pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
        });
        this.pokemonsSubject.next(data);
        return data;
      })
    );
  }

  getPokemonById(id: number) {
    if (this.pokemonsSubject.value['count'] > 0) {
      return this.pokemonsSubject.pipe(
        map((pokemons: any) => {
          console.log('pokemons', pokemons);
          return pokemons.results[id - 1 - this.offset]
        })
      );
    } else {
      return this.getAllPokemons().pipe(
        map((pokemons: any) => pokemons.results[id - 1 - this.offset])
      );
    }
  }

  updatePokemon(id: number, pokemon: any) {
    console.log('pokeListUpdate', this.pokemonsSubject.value)
    if (this.pokemonsSubject.value['count'] > 0) {
      this.pokemonsSubject.value['results'][id - this.offset] = pokemon;
    } else {
      this.getAllPokemons().subscribe((data: any) => {
        data.results[id] = pokemon;
      });
    }
  }

  deletePokemon(id: number) {
    this.pokemonsSubject.value['results'].splice(id - this.offset, 1)
    this.pokemonsSubject.value['results'].forEach((pokemon: any, index: number) => {
      pokemon.id = index + 1;
    });
    return this.pokemonsSubject;
  }
}
