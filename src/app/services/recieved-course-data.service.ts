import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecievedCourseDataService {
  private courseDataSubject = new BehaviorSubject<{ courseName: string, courseCode: string }>({
    courseName: '',
    courseCode: ''
  });
  addedCourseData$ = this.courseDataSubject.asObservable();

  constructor() {}

  setCourseData(courseData: { courseName: string, courseCode: string }) {
    this.courseDataSubject.next(courseData);
  }
}
