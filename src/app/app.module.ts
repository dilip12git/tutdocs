import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HolderComponent } from './components/holder/holder.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { OAuthModule } from 'angular-oauth2-oidc';
import { AddUniviComponent } from './user_info/add-univi/add-univi.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddInstitutionComponent } from './user_info/add-institution/add-institution.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserHomeComponent } from './Dashboard/user-home/user-home.component';
import { UniversityComponent } from './Dashboard/university/university.component';
import { SearchResultComponent } from './Dashboard/search-result/search-result.component';
import { HighSchoolComponent } from './Dashboard/high-school/high-school.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChooseFileComponent } from './upload-components/choose-file/choose-file.component';
import { UserProfileComponent } from './user_info/user-profile/user-profile.component';
import { UserSignInComponent } from './user_info/user-sign-in/user-sign-in.component';
import { FileDetailsComponent } from './upload-components/file-details/file-details.component';
import { DoneComponent } from './upload-components/done/done.component';
import { AddCoursesComponent } from './upload-components/add-courses/add-courses.component';
import { ErrorDisplayComponent } from './error-display/error-display.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CreateNewPasswordComponent } from './auth/create-new-password/create-new-password.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SettingComponent } from './Dashboard/setting/setting.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { SimpleHeaderComponent } from './components/simple-header/simple-header.component';
import { ViewersComponent } from './doc-viewers/viewers/viewers.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InstitutionsComponent } from './Dashboard/institutions/institutions.component';
import { CoursesComponent } from './Dashboard/courses/courses.component';
import { MyLibraryComponent } from './Dashboard/my-library/my-library.component';
import { EditFileComponent } from './Dashboard/edit-file/edit-file.component';
import { ViewDetailsComponent } from './Dashboard/view-details/view-details.component';
import { TermsComponent } from './Dashboard/terms/terms.component';
import { PrivacyPolicyComponent } from './Dashboard/privacy-policy/privacy-policy.component';
import { AllCoursesComponent } from './Dashboard/all-courses/all-courses.component';
import { NotificationsComponent } from './Dashboard/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    HolderComponent,
    AddUniviComponent,
    AddInstitutionComponent,
    UserDashboardComponent,
    UserHomeComponent,
    UniversityComponent,
    SearchResultComponent,
    HighSchoolComponent,
    ChooseFileComponent,
    UserProfileComponent,
    UserSignInComponent,
    FileDetailsComponent,
    DoneComponent,
    AddCoursesComponent,
    ErrorDisplayComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    CreateNewPasswordComponent,
    PageNotFoundComponent,
    SettingComponent,
    VerifyEmailComponent,
    SimpleHeaderComponent,
    ViewersComponent,
    InstitutionsComponent,
    CoursesComponent,
    MyLibraryComponent,
    EditFileComponent,
    ViewDetailsComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    AllCoursesComponent,
    NotificationsComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    OAuthModule.forRoot(),
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PdfViewerModule,
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
 
    
    
  ],

  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
