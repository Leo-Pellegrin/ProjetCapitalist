import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {World, Palier, Product} from './world'; 
import { WebserviceService } from './webservice.service';

@Component({
  selector: 'app-root',
  standalone: true,
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
})
