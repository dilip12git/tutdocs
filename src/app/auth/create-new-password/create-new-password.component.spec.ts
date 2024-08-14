import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPasswordComponent } from './create-new-password.component';

describe('CreateNewPasswordComponent', () => {
  let component: CreateNewPasswordComponent;
  let fixture: ComponentFixture<CreateNewPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewPasswordComponent]
    });
    fixture = TestBed.createComponent(CreateNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
