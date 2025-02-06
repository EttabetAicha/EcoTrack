import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  isSidebarOpen = true;
  profileForm: FormGroup;
  currentUser: User | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
      streetAddress: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,]+$/)]],
      birthDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue(user);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid) {
      const success = await this.authService.updateProfile(this.profileForm.value);
      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Profil mis à jour avec succès',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de la mise à jour du profil',
        });
      }
    }
  }
}
