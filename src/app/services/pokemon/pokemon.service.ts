import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from 'src/app/interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=200';

  private pokemonsSubject = new BehaviorSubject<Pokemon[]>([]);
  pokemons$ = this.pokemonsSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('PokemonService');
    this.getAllPokemons().subscribe(() => { });
  }

  getAllPokemons() {
    return this.http.get(this.url).pipe(
      map((data: any) => {
        data.results.forEach((pokemon: any, index: number) => {
          pokemon.id = index + 1;
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
          return pokemons.results[id - 1]
        })
      );
    } else {
      return this.getAllPokemons().pipe(
        map((pokemons: any) => pokemons.results[id - 1])
      );
    }
  }

  updatePokemon(id: number, pokemon: any) {
    console.log('pokeListUpdate', this.pokemonsSubject.value)
    if (this.pokemonsSubject.value['count'] > 0) {
      this.pokemonsSubject.value['results'][id] = pokemon;
    } else {
      this.getAllPokemons().subscribe((data: any) => {
        data.results[id] = pokemon;
      });
    }
  }

  deletePokemon(id: number) {
    this.pokemonsSubject.value['results'].splice(id, 1)
    // update id
    this.pokemonsSubject.value['results'].forEach((pokemon: any, index: number) => {
      pokemon.id = index + 1;
    });
    return this.pokemonsSubject;
  }
}
