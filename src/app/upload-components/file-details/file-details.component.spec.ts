import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetailsComponent } from './file-details.component';

describe('FileDetailsComponent', () => {
  let component: FileDetailsComponent;
  let fixture: ComponentFixture<FileDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileDetailsComponent]
    });
    fixture = TestBed.createComponent(FileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
