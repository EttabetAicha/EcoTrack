import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  imagePreview: string | null = null;
  errorMessage: string | null = null;
  originalFileName: string | null = null;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      streetAddress: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      profilePicture: [null]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Only image files are allowed';
        return;
      }
      // Store original filename
      this.originalFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.registerForm.patchValue({ profilePicture: this.originalFileName });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.registerForm.patchValue({
      profilePicture: null
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const success = await this.authService.register(this.registerForm.value);
      if (success) {
        console.log('Registration successful');
        this.router.navigate(['/login']);
      } else {
        console.error('Registration failed');
      }
    }
  }
}
