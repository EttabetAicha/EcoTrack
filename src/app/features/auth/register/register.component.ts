import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('errorState', [
      state('hidden', style({
        opacity: 0,
        height: '0px'
      })),
      state('visible', style({
        opacity: 1,
        height: '*'
      })),
      transition('hidden => visible', [
        animate('300ms ease-in')
      ]),
      transition('visible => hidden', [
        animate('300ms ease-out')
      ])
    ])
  ]
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
      address: ['', [Validators.required, this.addressValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
      birthDate: ['', Validators.required],
      profilePicture: [null]
    });
  }

  private addressValidator(control: AbstractControl) {
    const address = control.value;
    if (typeof address !== 'string') {
      return { invalidAddress: true };
    }
    const parts = address.split(',');
    if (parts.length < 3) {
      return { invalidAddress: true };
    }
    return null;
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

  onSubmit() {
    console.log('Form submitted');
    if (this.registerForm.valid) {
      console.log('Form is valid');
      const addressValue = this.registerForm.get('address')?.value;
      if (typeof addressValue === 'string') {
        const parts = addressValue.split(',');
        if (parts.length >= 3) {
          const formattedAddress = {
            street: parts[0].trim(),
            postalCode: parts[1].trim(),
            city: parts[2].trim()
          };
          this.registerForm.patchValue({ address: formattedAddress });
        } else {
          this.errorMessage = 'Invalid address format';
          return;
        }
      } else {
        this.errorMessage = 'Invalid address format';
        return;
      }

      console.log('Calling register service');
      this.authService.register(this.registerForm.value).subscribe(success => {
        if (success) {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Error',
            text: 'Email already in use',
          });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
