import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationUpdateComponent } from './reclamation-update.component';

describe('ReclamationUpdateComponent', () => {
  let component: ReclamationUpdateComponent;
  let fixture: ComponentFixture<ReclamationUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReclamationUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReclamationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
