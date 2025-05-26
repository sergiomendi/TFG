import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import Marzipano from 'marzipano';
import { CheckboxModule } from 'primeng/checkbox';
import { MiDialogComponent } from '../../components/dialog/dialog.component';
import { MessageModule } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { ButtonBarComponent } from './button-bar/button-bar.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiService } from '../../services/api.service';
import { getCurrentDayUnix } from '../../helpers/time';

@Component({
  selector: 'play',
  standalone: true,
  templateUrl: './play.component.html',
  imports: [
    CheckboxModule,
    NgIf,
    NgFor,
    MiDialogComponent,
    MessageModule,
    ButtonBarComponent,
    ProgressSpinnerModule,
  ],
})
export class PlayComponent implements AfterViewInit {
  @ViewChild('pano', { static: true }) panoElement!: ElementRef;
  @ViewChild('container') containerElement!: ElementRef;
  @ViewChild('dialogSalir') dialogSalir: Dialog | undefined;

  public title: string = 'Inicio';
  private isAnimating = false; // Flag para controlar la animación
  public isFullscreen = false;
  // Variables para controlar la visibilidad de las flechas
  public hideNextArrow: boolean = false;
  public hidePrevArrow: boolean = false;
  idExperiencia: number = 0;
  ModalSalirVisible: boolean = false;
  isLoading: boolean = true; // Variable para controlar el indicador de carga
  images: any[] = [];

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const idEscena = urlParams.get('idEscena');
    const idExperiencia = urlParams.get('idExperiencia');
    this.idExperiencia = Number(idExperiencia);
    if (idEscena) {
      this.apiService
        .getArchivosPorEscena(Number(idEscena))
        .subscribe((files: any) => {
          this.images = files.map((file: any, index: number) => ({
            url: URL.createObjectURL(file.file),
            retos: file.retos,
          }));
        });
    }
  }
  currentImageIndex: number = 0;
  viewer: any;
  scene: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {}

  ngAfterViewInit() {
    this.loadScene();
    // Actualizar visibilidad de flechas
    this.hidePrevArrow = this.currentImageIndex === 0;
    this.hideNextArrow = this.currentImageIndex === this.images.length - 1;
  }
  loadScene() {
    // Mostrar el indicador de carga
    this.isLoading = true;

    // Initialize Marzipano
    const viewerElement = this.panoElement.nativeElement;

    this.viewer = new Marzipano.Viewer(viewerElement);

    // Create a source
    const source = Marzipano.ImageUrlSource.fromString(
      this.images[this.currentImageIndex].url
    );

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

    // Create a view with the limiter and set the initial FOV
    const initialFov = (minFov + maxFov) / 2; // Ajusta este valor según sea necesario
    const view = new Marzipano.RectilinearView({ fov: initialFov }, limiter);

    // Create a scene
    this.scene = this.viewer.createScene({
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

    this.viewer.setIdleMovement(6000, autorotate);

    // Display the scene
    this.scene.switchTo();

    // Crear un objeto Image para cargar la imagen y detectar cuándo se ha cargado
    const img = new Image();
    img.src = this.images[this.currentImageIndex];
    img.onload = () => {
      // Ocultar el indicador de carga después de que la imagen se haya cargado
      this.isLoading = false;
      this.cdr.detectChanges(); // Detectar cambios manualmente para evitar el error ExpressionChangedAfterItHasBeenCheckedError
    };
    this.isLoading = false;
  }

  onChangeImage(direction: string) {
    if (
      direction === 'next' &&
      this.currentImageIndex < this.images.length - 1
    ) {
      this.currentImageIndex++;
    } else if (direction === 'previous' && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      // No cambiar la imagen si se alcanza el tope
      return;
    }

    // Actualizar visibilidad de flechas
    this.hidePrevArrow = this.currentImageIndex === 0;
    this.hideNextArrow = this.currentImageIndex === this.images.length - 1;

    // Cargar la nueva escena
    this.loadScene();
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
    this.apiService.updateExperiencia(this.idExperiencia, {
      fechaFin: getCurrentDayUnix(),
    });
    this.router.navigate(['/escenas']);
  }

  showDialogSalir() {
    if (this.dialogSalir) {
      this.dialogSalir.visible = true;
    }
  }
}
