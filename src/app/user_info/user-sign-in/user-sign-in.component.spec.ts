import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignInComponent } from './user-sign-in.component';

describe('UserSignInComponent', () => {
  let component: UserSignInComponent;
  let fixture: ComponentFixture<UserSignInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSignInComponent]
    });
    fixture = TestBed.createComponent(UserSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
