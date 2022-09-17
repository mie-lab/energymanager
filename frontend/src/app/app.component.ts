import {Component} from '@angular/core';
import {WebcamImage} from "ngx-webcam";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // webcamImage: WebcamImage = null;
  webcamImage: WebcamImage | undefined;

  constructor(private http: HttpClient) {
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;

    this.http.post<WebcamImage>("http://localhost:8989/process_floorplan", {"image_data": this.webcamImage.imageAsBase64, "image_shape": '(640,480)'}, httpOptions).subscribe(data => {
      console.log("Did the post request to the backend!");
    })
  }
}
