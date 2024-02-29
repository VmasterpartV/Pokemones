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
  selectedPokemonId: number;
  currentPage = 1;
  lastPage = 0;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getPokemons();
    this.lastPage = this.pokemonService.totalPages;
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

  editPokemon(id: number) {
    this.selectedPokemonId = id;
  }

  savePokemon(pokemon: Pokemon) {
    this.pokemonService.updatePokemon(pokemon.id - 1, pokemon);
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
        if (id === this.selectedPokemonId) {
          this.selectedPokemonId = null;
        }
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

  setPage(page: number) {
    this.currentPage = page;
    this.pokemonService.offset = (page - 1) * 10;
    this.pokemonService.getAllPokemons().subscribe(() => { });
    this.selectedPokemonId = null;
  }

  getPagesRange() {
    // show 3 pages before and after the current page
    const range = 3;
    const start = Math.max(1, this.currentPage - range);
    const end = Math.min(this.pokemonService.totalPages, this.currentPage + range);
    return Array(end - start + 1).fill(0).map((_, i) => start + i);
  }

}
