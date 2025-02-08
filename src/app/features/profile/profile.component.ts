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
      address: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,]+$/)]],
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
  async onDeleteProfile(): Promise<void> {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action est irréversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      const success = await this.authService.removeAccount();
      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Supprimé!',
          text: 'Votre profil a été supprimé.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de la suppression du profil',
        });
      }
    }
  }
}
