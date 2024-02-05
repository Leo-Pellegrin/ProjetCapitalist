import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {World, Palier, Product} from './world'; 
import { WebserviceService } from './webservice.service';
import { ProductComponent } from './product/product.component';
import {GET_SERV } from '../request';
import { BigvaluePipe } from './bigvalue.pipe';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductComponent, BigvaluePipe],
  templateUrl: './app.component.html',
  styleUrl : './app.component.css',
})

export class AppComponent{
    title = 'bar-tabac';
    world: World = new World();
    server = GET_SERV;
    switchPositions = ['x1', 'x10', 'x100', 'Max'];
    currentPositionIndex = 0; 
    qtmulti = this.switchPositions[this.currentPositionIndex]; 
  
   
    toggleSwitch() {
      this.currentPositionIndex = (this.currentPositionIndex + 1) % this.switchPositions.length;
      this.qtmulti = this.switchPositions[this.currentPositionIndex];
    }

    constructor(private service: WebserviceService) {
      this.service.getWorld().then(
        world => {
          this.world = world.data.getWorld;
        }
      );
    }
}
