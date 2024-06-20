import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthConfirmMailComponent } from './auth-confirm-mail.component';

describe('AuthConfirmMailComponent', () => {
  let component: AuthConfirmMailComponent;
  let fixture: ComponentFixture<AuthConfirmMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthConfirmMailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthConfirmMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
