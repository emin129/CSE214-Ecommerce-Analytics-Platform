import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminCustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-profile',
  standalone: false,
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent implements OnInit {
  profiles: any[] = [];
  loading = false;
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(private profileService: AdminCustomerService) {}

  ngOnInit(): void {
    this.loadIncompleteProfiles();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page = 0;
      this.loadIncompleteProfiles();
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  loadIncompleteProfiles(): void {
    this.loading = true;
    this.profileService.getIncompleteProfiles(this.page, this.size, this.searchTerm).subscribe({
      next: (data) => {
        this.profiles = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.page = newPage;
      this.loadIncompleteProfiles();
    }
  }

  updateProfile(profile: any): void {
    if (!profile.id) return;
    this.loading = true;

    const updatePayload = {
      membershipType: profile.membershipType,
      city: profile.city,
      state: profile.state,
      zipCodePrefix: profile.zipCodePrefix
    };

    this.profileService.updateProfile(profile.id.toString(), updatePayload).subscribe({
      next: () => {
        this.loading = false;
        alert('Updated: ' + profile.membershipType.toUpperCase());
        this.loadIncompleteProfiles();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Update failed!');
      }
    });
  }
}
