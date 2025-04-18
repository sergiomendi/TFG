import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading,
} from '@awesome-cordova-plugins/device-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
  providers: [DeviceOrientation], // 👈 Necesario para usar el plugin
})
export class HomePage {
  photo: string | undefined;
  heading: number | undefined;
  private orientationWatcher: any;

  constructor(private deviceOrientation: DeviceOrientation) {}

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.photo = image.dataUrl;
  }

  startTrackingOrientation() {
    if (this.orientationWatcher) {
      this.orientationWatcher.unsubscribe();
    }

    this.orientationWatcher = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        this.heading = Math.round(data.magneticHeading);
        console.log('Heading:', this.heading);
      },
      (error) => {
        console.error('Error leyendo orientación', error);
      }
    );
  }

  stopTrackingOrientation() {
    if (this.orientationWatcher) {
      this.orientationWatcher.unsubscribe();
    }
  }
}
