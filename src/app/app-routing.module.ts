import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { DepartmentAddComponent } from './department-add/department-add.component';
import { DepartmentUpdateComponent } from './department-update/department-update.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { SubcategoryAddComponent } from './subcategory-add/subcategory-add.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';
import { SubcategoryUpdateComponent } from './subcategory-update/subcategory-update.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { BienAddComponent } from './bien-add/bien-add.component';
import { BienUpdateComponent } from './bien-update/bien-update.component';
import { HistoryComponent } from './history/history.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ListBranchesComponent } from './list-branches/list-branches.component';
import { AuthGuard } from './auth.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { AuthConfirmMailComponent } from './auth-confirm-mail/auth-confirm-mail.component';
import { BienDetailComponent } from './bien-detail/bien-detail.component';
import { ReservationpardateComponent } from './reservationpardate/reservationpardate.component';
import { DemoComponent } from './demo/demo.component';
import { WaitingListComponent } from './waiting-list/waiting-list.component';
import { WaitingListClaimComponent } from './waiting-list-claim/waiting-list-claim.component';

const routes: Routes = [
  { path: 'auth-sign-in', component: AuthSignInComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'set-new-password', component: SetNewPasswordComponent },
  { path: 'auth-confirm-mail', component: AuthConfirmMailComponent },
  { path: 'list-branch', component: ListBranchesComponent, canActivate: [AuthGuard] },
  { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },
  { path: 'benefits', component: BiensComponent, canActivate: [AuthGuard] },
  { path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] },
  { path: 'reclamations', component: ReclamationsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'branches', component: BranchesComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'departements', component: DepartementsComponent, canActivate: [AuthGuard] },
  { path: 'admin-profile-edit', component: AdminProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'user-add', component: UserAddComponent, canActivate: [AuthGuard] },
  { path: 'bien-add', component: BienAddComponent, canActivate: [AuthGuard] },
  { path: 'branch-add', component: BranchAddComponent, canActivate: [AuthGuard] },
  { path: 'department-add', component: DepartmentAddComponent, canActivate: [AuthGuard] },
  { path: 'category-add', component: CategoryAddComponent, canActivate: [AuthGuard] },
  { path: 'subcategory-add', component: SubcategoryAddComponent, canActivate: [AuthGuard] },
  { path: 'user-update/:id', component: UserUpdateComponent, canActivate: [AuthGuard] },
  { path: 'bien-update', component: BienUpdateComponent, canActivate: [AuthGuard] },
  { path: 'branch-update', component: BranchUpdateComponent, canActivate: [AuthGuard] },
  { path: 'department-update', component: DepartmentUpdateComponent, canActivate: [AuthGuard] },
  { path: 'category-update', component: CategoryUpdateComponent, canActivate: [AuthGuard] },
  { path: 'subcategory-update', component: SubcategoryUpdateComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  {path: 'bien-detail' , component: BienDetailComponent, canActivate: [AuthGuard]},
  {path: 'new-reservation' , component: ReservationpardateComponent, canActivate: [AuthGuard]},
  {path: 'demo' , component: DemoComponent, canActivate: [AuthGuard]},
  {path: 'waiting-list-reservation' , component: WaitingListComponent, canActivate: [AuthGuard]},
  {path: 'waiting-list-claim' , component: WaitingListClaimComponent, canActivate: [AuthGuard]},
  { path: '404', component: NotfoundComponent },
  { path: '', redirectTo: '/auth-sign-in', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
