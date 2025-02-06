import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      streetAddress: [''],
      birthDate: [''],
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
          title: 'Registration Error',
          text: 'Profil mis à jour avec succès',
        });
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Registration Error',
          text: 'Échec de la mise à jour du profil',
        });
      }
    }    

  }
}
