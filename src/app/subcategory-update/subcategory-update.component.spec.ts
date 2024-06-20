import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryUpdateComponent } from './subcategory-update.component';

describe('SubcategoryUpdateComponent', () => {
  let component: SubcategoryUpdateComponent;
  let fixture: ComponentFixture<SubcategoryUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubcategoryUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubcategoryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
