import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewersComponent } from './viewers.component';

describe('ViewersComponent', () => {
  let component: ViewersComponent;
  let fixture: ComponentFixture<ViewersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewersComponent]
    });
    fixture = TestBed.createComponent(ViewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
