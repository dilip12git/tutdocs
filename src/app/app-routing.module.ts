import { NgModule } from '@angular/core';
//import { RouterModule, Routes } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { HolderComponent } from './components/holder/holder.component';
import { AddUniviComponent } from './user_info/add-univi/add-univi.component';
import { AddInstitutionComponent } from './user_info/add-institution/add-institution.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserHomeComponent } from './Dashboard/user-home/user-home.component';
import { SearchResultComponent } from './Dashboard/search-result/search-result.component';
import { UniversityComponent } from './Dashboard/university/university.component';
import { ChooseFileComponent } from './upload-components/choose-file/choose-file.component';
import { UserProfileComponent } from './user_info/user-profile/user-profile.component';
import { UserSignInComponent } from './user_info/user-sign-in/user-sign-in.component';
import { FileDetailsComponent } from './upload-components/file-details/file-details.component';
import { DoneComponent } from './upload-components/done/done.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CreateNewPasswordComponent } from './auth/create-new-password/create-new-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SettingComponent } from './Dashboard/setting/setting.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ViewersComponent } from './doc-viewers/viewers/viewers.component';
import { InstitutionsComponent } from './Dashboard/institutions/institutions.component';
import { HighSchoolComponent } from './Dashboard/high-school/high-school.component';
import { CoursesComponent } from './Dashboard/courses/courses.component';
import { MyLibraryComponent } from './Dashboard/my-library/my-library.component';
import { EditFileComponent } from './Dashboard/edit-file/edit-file.component';
import { ViewDetailsComponent } from './Dashboard/view-details/view-details.component';
import { TermsComponent } from './Dashboard/terms/terms.component';
import { PrivacyPolicyComponent } from './Dashboard/privacy-policy/privacy-policy.component';
import { AllCoursesComponent } from './Dashboard/all-courses/all-courses.component';
import { NotificationsComponent } from './Dashboard/notifications/notifications.component';

const routes: Routes = [
  { path: '', component: HolderComponent ,pathMatch: 'full' },
  { path: 'add', component: AddUniviComponent },
  { path: 'add-institute', component: AddInstitutionComponent },
  { path: 'upload', component: ChooseFileComponent },
  { path: 'add-files-details', component: FileDetailsComponent },
  { path: 'done', component: DoneComponent },
  { path: 'sign-in', component: UserSignInComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/create-new-password', component: CreateNewPasswordComponent },
   {path: 'verify-email',component:VerifyEmailComponent},
  { path: '', component: UserDashboardComponent,
    children: [
      { path: 'home', component: UserHomeComponent },
      { path: 'search', component: SearchResultComponent },
      { path: 'universities', component: UniversityComponent },
      { path: 'schools', component: HighSchoolComponent },
      { path: 'institutions', component: InstitutionsComponent },
      { path: 'setting', component:SettingComponent},
      { path: 'courses', component:CoursesComponent},
      { path: 'library', component:MyLibraryComponent},
      { path: 'edit', component:EditFileComponent},
      { path: 'terms', component:TermsComponent},
      {path: 'view',component:ViewersComponent},
      { path: 'notifications', component:NotificationsComponent},
      { path: 'all-courses', component:AllCoursesComponent},
      { path: 'privacy-policy', component:PrivacyPolicyComponent},
      { path: 'view-details', component:ViewDetailsComponent},
      { path: 'profile/:userID', component: UserProfileComponent },
      { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
    ]
  },

  { path: 'not-found', component: PageNotFoundComponent }, 
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' }, 
];



@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top',
   //  useHash: true // Scroll to top on navigation
  })],

  exports: [RouterModule]
})
export class AppRoutingModule { }
