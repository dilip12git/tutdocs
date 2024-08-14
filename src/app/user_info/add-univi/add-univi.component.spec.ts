import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUniviComponent } from './add-univi.component';

describe('AddUniviComponent', () => {
  let component: AddUniviComponent;
  let fixture: ComponentFixture<AddUniviComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUniviComponent]
    });
    fixture = TestBed.createComponent(AddUniviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
