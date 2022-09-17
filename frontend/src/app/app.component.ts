import {Component} from '@angular/core';
import {WebcamImage} from "ngx-webcam";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs";

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

    this.http.post<WebcamImage>("https://fast-hamlet-23582.herokuapp.com/", this.webcamImage).subscribe(data => {
      console.log("Did the post request to the backend!");
    })
  }
}
