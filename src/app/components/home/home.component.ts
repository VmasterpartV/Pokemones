import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';
import { Pokemon } from 'src/app/interfaces/pokemon';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pokemons: Pokemon[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons() {
    try {
      this.pokemonService.pokemons$.subscribe((pokemons: Pokemon[]) => {
        this.pokemons = pokemons['results'];
      });
    } catch (error) {
      console.error(error);
    }
  }

  deletePokemon(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pokemonService.deletePokemon(id - 1).subscribe((data: any) => {
          this.pokemons = data.results;
        }, error => {
          console.error(error);
        });
        Swal.fire({
          title: 'Borrado!',
          text: 'El pokemon ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
      })
      }
    });
  }

}
