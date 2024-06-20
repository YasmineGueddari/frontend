import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationUpdateComponent } from './reservation-update.component';

describe('ReservationUpdateComponent', () => {
  let component: ReservationUpdateComponent;
  let fixture: ComponentFixture<ReservationUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
