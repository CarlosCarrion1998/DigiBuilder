import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CartasComponent } from '../components/cartas/cartas.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CabeceraComponent } from "../components/cabecera/cabecera.component";

@Component({
    selector: 'app-mainpage',
    standalone: true,
    templateUrl: './mainpage.component.html',
    styleUrl: './mainpage.component.css',
    imports: [NgFor, NgIf, CartasComponent, CabeceraComponent]
})
export class MainpageComponent {

//   digimonService: DigimonService;
//   cards: any[] = [];

// constructor(digimonService: DigimonService) {
//     this.digimonService = digimonService;
    
// }

  // ngOnInit(): void {
  //   this.digimonService.getAllCards().subscribe(
  //     (data: any) => {
  //       this.cards = data;
  //       console.log(this.cards);
  //     },
  //     (error: any) => {
  //       console.error('Error fetching data', error);
  //     }
  //   );
  // }
}
