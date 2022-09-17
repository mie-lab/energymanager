import {Component, ElementRef, ViewChild} from '@angular/core';
import {WebcamImage} from "ngx-webcam";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // webcamImage: WebcamImage = null;
  webcamImage: WebcamImage | undefined;
  title = "EnergyManager"
  showCamera: boolean = true;
  showTable: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;

    this.http.post<WebcamImage>("https://fast-hamlet-23582.herokuapp.com/process_floorplan", {"image_data": this.webcamImage.imageAsBase64}, httpOptions).subscribe(data => {
      console.log("Did the post request to the backend!");

      this.showCamera = false;
      this.showTable = true;
    })
  }
}
