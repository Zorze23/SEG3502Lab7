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
  templateUrl: './authors.component.html',
  styles: [`
    :host {
      display: block;
      color: #494454;
    }

    .intro {
      text-align: center;
      margin-bottom: 32px;
    }

    .eyebrow {
      display: inline-block;
      padding: 8px 16px;
      margin-bottom: 18px;
      border-radius: 999px;
      background: #eee8f3;
      color: #756582;
      font-size: 12px;
    }

    h1 {
      font-size: clamp(30px, 5vw, 40px);
      font-weight: 600;
      letter-spacing: -1.4px;
      margin-bottom: 14px;
    }

    .intro p,
    .hint,
    .empty-state p,
    .author-id,
    .loading {
      color: #79717e;
    }

    .search-card,
    .profile {
      background: #fffefd;
      border-radius: 30px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(84, 65, 103, 0.035);
    }

    label {
      display: block;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #625b6e;
    }

    .search-row {
      display: flex;
      gap: 12px;
    }

    input {
      flex: 1;
      min-width: 0;
      width: 100%;
      border: 1px solid #e5dfec;
      border-radius: 999px;
      background: #f6f3f8;
      color: #494454;
      padding: 14px 20px;
      font: inherit;
    }

    button {
      border: none;
      border-radius: 999px;
      padding: 14px 24px;
      background: #e5dcef;
      color: #59466e;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
      background: #d9cde7;
    }

    button:disabled {
      opacity: 0.65;
      cursor: wait;
    }

    input:focus-visible,
    button:focus-visible {
      outline: 2px solid #9582aa;
      outline-offset: 3px;
    }

    .hint {
      margin: 14px 0 0;
      font-size: 13px;
    }

    .loading {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
    }

    .message {
      margin-top: 24px;
      padding: 20px;
      border-radius: 24px;
      background: #f7ece5;
      color: #805e4e;
      text-align: center;
    }

    .empty-state {
      text-align: center;
      padding: 42px 20px;
    }

    .empty-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 16px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #eeeee4;
      color: #7b8063;
      font-size: 30px;
    }

    .empty-state h2 {
      font-size: 16px;
      font-weight: 600;
    }

    .empty-state p {
      font-size: 14px;
      margin-bottom: 0;
    }

    .profile {
      margin-top: 24px;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 30px;
    }

    .avatar {
      width: 66px;
      height: 66px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #ede5f2;
      color: #756080;
      font-size: 23px;
      font-weight: 600;
    }

    .profile h2 {
      font-size: 25px;
      font-weight: 600;
      letter-spacing: -0.6px;
      margin-bottom: 4px;
      overflow-wrap: anywhere;
    }

    .author-id {
      font-size: 13px;
      margin: 0;
    }

    .books-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .books-heading h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .book-count {
      padding: 5px 12px;
      border-radius: 999px;
      background: #eef0e7;
      color: #616b4e;
      font-size: 12px;
      white-space: nowrap;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li,
    .no-books {
      padding: 16px 20px;
      border-radius: 22px;
      background: #f7f5f9;
      color: #625b6e;
      margin-bottom: 8px;
      overflow-wrap: anywhere;
    }

    .book-star {
      margin-right: 12px;
      color: #9c88ad;
    }

    .no-books {
      font-size: 14px;
      margin-bottom: 0;
    }

    @media (max-width: 540px) {
      .search-card,
      .profile {
        padding: 24px;
      }

      .search-row {
        flex-direction: column;
      }
    }
  `]
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