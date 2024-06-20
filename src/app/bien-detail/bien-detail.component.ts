import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-bien-detail',
  templateUrl: './bien-detail.component.html',
  styleUrls: ['./bien-detail.component.css']
})
export class BienDetailComponent implements OnInit {
  @Input() bienId: any;
  bien: any;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getBienById(this.bienId);
    console.log('bienId',this.bienId);
  }

  ngOnChanges(): void {
    if (this.bienId) {
      this.getBienById(this.bienId);
      console.log('this.bienId2' , this.bienId);
    }
  }

  
  getBienById(bienId: any): void {
    this.sharedService.getBienById(bienId).subscribe(
      (data) => {
        this.bien = data;
        console.log('bien bien', data);
      },
      (error) => {
        console.error('Error fetching bien:', error);
      }
    );
  }
}
