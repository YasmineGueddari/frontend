import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienAddComponent } from './bien-add.component';

describe('BienAddComponent', () => {
  let component: BienAddComponent;
  let fixture: ComponentFixture<BienAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BienAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
