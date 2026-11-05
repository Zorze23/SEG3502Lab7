import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooksService } from '../books/service/books.service';
import { AuthorDetails } from '../books/model/book';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authors.component.html'
})
export class AuthorsComponent implements OnDestroy {
  authorId: number | null = null;
  author: AuthorDetails | null = null;
  message = '';
  loading = false;

  private booksService = inject(BooksService);
  private subscription?: Subscription;

  search(): void {
    this.subscription?.unsubscribe();
    this.author = null;
    this.message = '';
    this.loading = false;

    if (
      this.authorId === null ||
      !Number.isSafeInteger(this.authorId) ||
      this.authorId <= 0
    ) {
      this.message = 'Enter a valid positive author ID.';
      return;
    }

    this.loading = true;

    this.subscription = this.booksService.getAuthor(this.authorId).subscribe({
      next: author => {
        this.author = author;
        this.loading = false;
      },
      error: error => {
        this.message = error.status === 404
          ? 'No author found with this ID.'
          : 'Unable to load the author. Check that the server is running.';

        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}