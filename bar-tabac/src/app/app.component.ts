import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {World, Palier, Product} from './world'; 
import { WebserviceService } from './webservice.service';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet],
  templateUrl: '../app.component.html',
  title = 'bar-tabac',
  world: World = new World(),
  

  constructor(private service: WebserviceService) {
    this.service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
      }
    );
  }
=======
  imports: [RouterOutlet, ProductComponent],
  templateUrl: './app.component.html',
>>>>>>> c503305a39d7395c87f14d6f4bd89b257dbc13d8
})

export class AppComponent{
    title = 'bar-tabac'
    world: World = new World()

    constructor(private service: WebserviceService) {
      this.service.getWorld().then(
        world => {
          this.world = world.data.getWorld;
        }
      );
    }
}
