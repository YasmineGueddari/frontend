import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationpardateComponent } from './reservationpardate.component';

describe('ReservationpardateComponent', () => {
  let component: ReservationpardateComponent;
  let fixture: ComponentFixture<ReservationpardateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationpardateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationpardateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
