import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';
import { Pokemon } from 'src/app/interfaces/pokemon';
import Swal from 'sweetalert2'

@Component({
  selector: 'edit-pokemon',
  templateUrl: './edit-pokemon.component.html',
  styleUrls: ['./edit-pokemon.component.css']
})
export class EditPokemonComponent implements OnChanges {

  @Input() pokemonId: number;
  @Output() pokemonUpdated = new EventEmitter<Pokemon>();

  @ViewChild('btnSubmit') btnSubmit !: ElementRef;

  pokemon: Pokemon;

  pokemonForm: FormGroup;

  file: File | null = null;
  imageUrl: string;

  constructor(
    private pokemonService: PokemonService,
    private formBuilder: FormBuilder
  ) {
    this.pokemonForm = this.createForm();
    this.pokemonForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.btnSubmit.nativeElement.disabled = false;
        this.btnSubmit.nativeElement.classList.add('btn-primary');
        this.btnSubmit.nativeElement.classList.remove('btn-warning');
        this.btnSubmit.nativeElement.textContent = 'Guardar';
      } else {
        this.btnSubmit.nativeElement.disabled = true;
        this.btnSubmit.nativeElement.classList.add('btn-warning');
        this.btnSubmit.nativeElement.classList.remove('btn-primary');
        this.btnSubmit.nativeElement.textContent = 'Error';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemonId']) {
      const newPokemonId = changes['pokemonId'].currentValue;
      this.getPokemon(newPokemonId);
      this.file = null;
      this.pokemonForm.get('image').setValue(null);
    }
  }

  getPokemon(id: number) {
    this.pokemonService.getPokemonById(id).subscribe((pokemon: any) => {
      console.log('pokemon', pokemon);
      this.pokemon = pokemon;
      this.pokemonForm.get('name').setValue(this.pokemon.name);
      this.imageUrl = this.pokemon.image;
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
    const blob = new Blob([this.file], { type: 'image/*' });
    const imageUrl = URL.createObjectURL(blob);
    this.imageUrl = imageUrl;
  }

  onSubmit() {
    const pokemon = this.pokemonForm.value;
    pokemon.id = this.pokemon.id;
    pokemon.url = this.pokemon.url;
    pokemon.image = this.imageUrl;
    // output pokemon
    this.pokemonUpdated.emit(pokemon);
    Swal.fire({
      title: "Pokemon actualizado",
      text: "Redirigiendo a la vista de pokemons",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6"
    })
  }
}
