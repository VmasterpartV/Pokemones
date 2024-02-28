import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';
import { Pokemon } from 'src/app/interfaces/pokemon';
import Swal from 'sweetalert2'

@Component({
  selector: 'edit-pokemon',
  templateUrl: './edit-pokemon.component.html',
  styleUrls: ['./edit-pokemon.component.css']
})
export class EditPokemonComponent implements OnInit {

  pokemon: Pokemon;

  pokemonForm: FormGroup;

  file: File | null = null;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.pokemonForm = this.createForm();
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.getPokemon(id);
  }

  getPokemon(id: number) {
    this.pokemonService.getPokemonById(id).subscribe((pokemon: any) => {
      this.pokemon = pokemon;
      this.pokemonForm.get('name').setValue(this.pokemon.name);
    }, error => {
      console.error(error);
    });
  }

  createForm() {
    return this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      image: new FormControl(null),
      url: new FormControl('')
    });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const blob = new Blob([this.file], { type: 'image/*' });
      const imageUrl = URL.createObjectURL(blob);
      this.pokemon.image = imageUrl;
    }
  }

  onSubmit() {
    const pokemon = this.pokemonForm.value;
    pokemon.id = this.pokemon.id;
    pokemon.url = this.pokemon.url;
    pokemon.image = this.pokemon.image;
    this.pokemonService.updatePokemon(this.pokemon.id - 1, pokemon);
    Swal.fire({
      title: "Pokemon actualizado",
      text: "Redirigiendo a la vista de pokemons",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6"
    }).then((result) => {
      this.router.navigate(['/']);
    });
  }
}
