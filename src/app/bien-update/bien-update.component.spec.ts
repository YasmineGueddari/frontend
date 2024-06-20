import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienUpdateComponent } from './bien-update.component';

describe('BienUpdateComponent', () => {
  let component: BienUpdateComponent;
  let fixture: ComponentFixture<BienUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BienUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
