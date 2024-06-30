import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BiensComponent } from './biens/biens.component';
import { IndexComponent } from './index/index.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReclamationsComponent } from './reclamations/reclamations.component';
import { UsersComponent } from './users/users.component';
import { CategoriesComponent } from './categories/categories.component';
import { DepartementsComponent } from './departements/departements.component';
import { AdminProfileEditComponent } from './admin-profile-edit/admin-profile-edit.component';
import { AuthSignInComponent } from './auth-sign-in/auth-sign-in.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { BranchesComponent } from './branches/branches.component';
import { BranchAddComponent } from './branch-add/branch-add.component';
import { BranchUpdateComponent } from './branch-update/branch-update.component';
import { DepartmentUpdateComponent } from './department-update/department-update.component';
import { DepartmentAddComponent } from './department-add/department-add.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';
import { SubcategoryUpdateComponent } from './subcategory-update/subcategory-update.component';
import { SubcategoryAddComponent } from './subcategory-add/subcategory-add.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { BienAddComponent } from './bien-add/bien-add.component';
import { BienUpdateComponent } from './bien-update/bien-update.component';
import { ReservationUpdateComponent } from './reservation-update/reservation-update.component';
import { ReclamationUpdateComponent } from './reclamation-update/reclamation-update.component';
import { ReclamationAddComponent } from './reclamation-add/reclamation-add.component';
import { HistoryComponent } from './history/history.component';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ListBranchesComponent } from './list-branches/list-branches.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { AuthConfirmMailComponent } from './auth-confirm-mail/auth-confirm-mail.component';
import { BienDetailComponent } from './bien-detail/bien-detail.component';
import { ReservationpardateComponent } from './reservationpardate/reservationpardate.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DemoComponent } from './demo/demo.component';
import { WaitingListComponent } from './waiting-list/waiting-list.component';
import { WaitingListClaimComponent } from './waiting-list-claim/waiting-list-claim.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    NavbarComponent,
    FooterComponent,
    BiensComponent,
    IndexComponent,
    ReservationsComponent,
    ReclamationsComponent,
    UsersComponent,
    CategoriesComponent,
    DepartementsComponent,
    AdminProfileEditComponent,
    AuthSignInComponent,
    UserAddComponent,
    UserUpdateComponent,
    BranchesComponent,
    BranchAddComponent,
    BranchUpdateComponent,
    DepartmentUpdateComponent,
    DepartmentAddComponent,
    CategoryUpdateComponent,
    SubcategoryUpdateComponent,
    SubcategoryAddComponent,
    CategoryAddComponent,
    NotfoundComponent,
    BienAddComponent,
    BienUpdateComponent,
    ReservationUpdateComponent,
    ReclamationUpdateComponent,
    ReclamationAddComponent,
    HistoryComponent,
    CalendarComponent,
    ListBranchesComponent,
    ResetPasswordComponent,
    SetNewPasswordComponent,
    AuthConfirmMailComponent,
    BienDetailComponent,
    ReservationpardateComponent,
    DemoComponent,
    WaitingListComponent,
    WaitingListClaimComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    RouterModule,
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    {provide: LocationStrategy , useClass:HashLocationStrategy},
    HttpClient,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
