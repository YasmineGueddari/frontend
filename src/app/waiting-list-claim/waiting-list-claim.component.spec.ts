import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingListClaimComponent } from './waiting-list-claim.component';

describe('WaitingListClaimComponent', () => {
  let component: WaitingListClaimComponent;
  let fixture: ComponentFixture<WaitingListClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaitingListClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WaitingListClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
