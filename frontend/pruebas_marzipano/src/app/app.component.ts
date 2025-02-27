import { Component, OnInit } from '@angular/core';
import Marzipano from 'marzipano';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'Inicio';

  ngOnInit() {
    // Initialize Marzipano
    const viewerElement = document.querySelector('#pano');
    const viewer = new Marzipano.Viewer(viewerElement);

    // Create a source
    const source = Marzipano.ImageUrlSource.fromString(
      'https://www.marzipano.net/media/equirect/angra.jpg'
    );

    // Create a geometry
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    // Create a view
    const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
    const view = new Marzipano.RectilinearView(null, limiter);

    // Create a scene
    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Display the scene
    scene.switchTo();
  }
  onChangeImage(direction: string) {
    console.log(`Image change requested: ${direction}`);
    // Implement the logic to change the image or perform other actions based on direction
  }
}
