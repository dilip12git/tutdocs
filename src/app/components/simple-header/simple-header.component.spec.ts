import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleHeaderComponent } from './simple-header.component';

describe('SimpleHeaderComponent', () => {
  let component: SimpleHeaderComponent;
  let fixture: ComponentFixture<SimpleHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleHeaderComponent]
    });
    fixture = TestBed.createComponent(SimpleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
