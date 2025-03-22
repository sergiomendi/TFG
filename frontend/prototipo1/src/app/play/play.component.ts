import { NgIf } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import Marzipano from 'marzipano';
import { CheckboxModule } from 'primeng/checkbox';
import { MiDialogComponent } from '../components/dialog/dialog.component';
import { MessageModule } from 'primeng/message';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'play',
  standalone: true,
  templateUrl: './play.component.html',
  imports: [CheckboxModule, NgIf, MiDialogComponent, MessageModule],
})
export class PlayComponent implements AfterViewInit {
  @ViewChild('pano', { static: true }) panoElement!: ElementRef;
  @ViewChild('container') containerElement!: ElementRef;
  @ViewChild('dialogSalir') dialogSalir: Dialog | undefined;

  public title: string = 'Inicio';
  private isAnimating = false; // Flag para controlar la animación
  public isFullscreen = false;
  ModalSalirVisible: boolean = false;

  constructor(private router: Router) {}
  ngAfterViewInit() {
    // Initialize Marzipano
    const viewerElement = this.panoElement.nativeElement;

    const viewer = new Marzipano.Viewer(viewerElement);

    // Create a source
    const source = Marzipano.ImageUrlSource.fromString('/assets/blinds.jpg');

    // Create a geometry
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    // Define FOV limits
    const minFov = 0.698131111111111; // 40 grados en radianes
    const maxFov = 2.09439333333333; // 120 grados en radianes

    // Create a limiter using compose
    const limiter = Marzipano.util.compose(
      Marzipano.RectilinearView.limit.vfov(minFov, maxFov), // Limita el campo de visión vertical
      Marzipano.RectilinearView.limit.hfov(minFov, maxFov), // Limita el campo de visión horizontal
      Marzipano.RectilinearView.limit.pitch(-Math.PI / 2, Math.PI / 2) // Limita el ángulo de inclinación
    );

    // Create a view with the limiter
    const view = new Marzipano.RectilinearView(null, limiter);

    // Depuración: Verificar los valores del FOV inicial
    console.log('Initial FOV:', view.fov());

    // Create a scene
    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    const autorotate = Marzipano.autorotate({
      yawSpeed: 0.05, // Yaw rotation speed
      targetPitch: 0, // Pitch value to converge to
      targetFov: Math.PI / 2, // Fov value to converge to
    });

    viewer.setIdleMovement(6000, autorotate);

    // Display the scene
    scene.switchTo();

    // Función para manejar el zoom
    const handleZoom = (event: WheelEvent) => {
      if (this.isAnimating) return; // Ignorar el evento si hay una animación en progreso

      event.preventDefault();
      const delta = event.deltaY;
      const currentFov = view.fov();
      const newFov = currentFov + delta * 0.01; // Ajusta la velocidad del zoom aquí
      const clampedFov = Math.min(Math.max(newFov, minFov), maxFov); // Asegura que el FOV esté dentro de los límites

      console.log('New FOV:', newFov, 'Clamped FOV:', clampedFov); // Depuración

      // Marcar que la animación está en progreso
      this.isAnimating = true;

      // Animación suave del zoom
      view.setParameters(
        { fov: clampedFov }, // Nuevo FOV
        200 // Duración de la animación en milisegundos
      );

      // Restablecer el flag después de la animación
      setTimeout(() => {
        this.isAnimating = false;
      }, 200); // Duración de la animación
    };

    // Enable mouse wheel zoom
    viewerElement.addEventListener('wheel', (event: Event) => {
      handleZoom(event as WheelEvent);
    });
  }

  onChangeImage(direction: string) {
    console.log(`Image change requested: ${direction}`);
    // Implement the logic to change the image or perform other actions based on direction
  }

  toogleFullScreen() {
    const elem = this.containerElement.nativeElement;

    if (!document.fullscreenElement) {
      this.isFullscreen = true;
      elem.requestFullscreen().catch((err: any) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      this.isFullscreen = false;
      document.exitFullscreen();
    }
  }

  exit() {
    this.router.navigate(['/escenas']);
  }

  showDialogSalir() {
    if (this.dialogSalir) {
      this.dialogSalir.visible = true;
    }
  }
}
