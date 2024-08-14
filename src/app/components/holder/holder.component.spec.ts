import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderComponent } from './holder.component';

describe('HolderComponent', () => {
  let component: HolderComponent;
  let fixture: ComponentFixture<HolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolderComponent]
    });
    fixture = TestBed.createComponent(HolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
