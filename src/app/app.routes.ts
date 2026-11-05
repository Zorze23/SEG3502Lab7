import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BooksComponent } from './books/books.component';
import { BookComponent } from './books/book/book.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthorsComponent } from './authors/authors.component';
import { loggedInGuard } from './logged-in.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'authors', component: AuthorsComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [loggedInGuard]
  },
  {
    path: 'books',
    component: BooksComponent,
    children: [
      { path: ':id', component: BookComponent }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: HomeComponent }
];