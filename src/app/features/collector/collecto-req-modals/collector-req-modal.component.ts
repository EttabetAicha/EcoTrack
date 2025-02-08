import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import * as CollectionActions from '../../../state/actions/collectionReq.actions';
import { CollectionRequest } from '../../../core/models/CollectionRequest.interface';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.interface';

@Component({
  selector: 'app-collection-request-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  template: `
    <div
      class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-screen relative"
    >
      <button
        type="button"
        (click)="onCancel()"
        class="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <form
        [formGroup]="collectionForm"
        (ngSubmit)="onSubmit()"
        class="px-6 py-4 space-y-4 overflow-y-auto"
      >
        <div class="flex flex-col items-center space-y-4">
          <div
            class="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-green-300 shadow-lg"
          >
            <img
              *ngIf="imagePreview"
              [src]="imagePreview"
              class="w-full h-full object-cover"
              alt="Aperçu des déchets"
            />
            <div
              *ngIf="!imagePreview"
              class="w-full h-full flex items-center justify-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <label
              class="cursor-pointer px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all text-sm"
            >
              <span>Choisir une photo</span>
              <input
                type="file"
                (change)="onFileSelected($event)"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
              />
            </label>
            <button
              *ngIf="imagePreview"
              type="button"
              (click)="removeImage()"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Supprimer
            </button>
          </div>
          <div *ngIf="fileError" class="text-red-600 text-sm">
            {{ fileError }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Type de Déchet</label
          >
          <div class="flex flex-wrap gap-4 mt-2" formGroupName="wasteType">
            <label class="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                formControlName="plastique"
                class="form-checkbox h-5 w-5 text-green-600"
              />
              <span class="text-gray-700">Plastique</span>
            </label>
            <label class="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                formControlName="verre"
                class="form-checkbox h-5 w-5 text-green-600"
              />
              <span class="text-gray-700">Verre</span>
            </label>
            <label class="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                formControlName="papier"
                class="form-checkbox h-5 w-5 text-green-600"
              />
              <span class="text-gray-700">Papier</span>
            </label>
            <label class="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                formControlName="metal"
                class="form-checkbox h-5 w-5 text-green-600"
              />
              <span class="text-gray-700">Métal</span>
            </label>
          </div>
          <div
            *ngIf="
              collectionForm.get('wasteType')?.invalid &&
              collectionForm.get('wasteType')?.touched
            "
            class="text-red-600 text-sm"
          >
            Au moins un type de déchet est requis
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Poids estimé (minimum 1000g obligatoire)</label
          >
          <input
            type="number"
            formControlName="estimatedWeight"
            class="mt-1 px-3 py-2 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
          />
          <div
            *ngIf="
              collectionForm.get('estimatedWeight')?.invalid &&
              collectionForm.get('estimatedWeight')?.touched
            "
            class="text-red-600 text-sm"
          >
            Le poids estimé doit être au moins de 1000g.
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            type="text"
            formControlName="address"
            class="mt-1 px-3 py-2 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
          />
          <div
            *ngIf="
              collectionForm.get('address')?.invalid &&
              collectionForm.get('address')?.touched
            "
            class="text-red-600 text-sm"
          >
            L'adresse doit contenir la rue, le code postal et la ville
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Date Préférée</label
            >
            <input
              type="date"
              formControlName="preferredDate"
              class="mt-1 px-3 py-2 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
            />
            <div
              *ngIf="
                collectionForm.get('preferredDate')?.invalid &&
                collectionForm.get('preferredDate')?.touched
              "
              class="text-red-600 text-sm"
            >
              Une date future valide est requise
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Heure Préférée</label
            >
            <input
              type="time"
              formControlName="preferredTimeSlot"
              class="mt-1 px-3 py-2 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
            />
            <div
              *ngIf="
                collectionForm.get('preferredTimeSlot')?.invalid &&
                collectionForm.get('preferredTimeSlot')?.touched
              "
              class="text-red-600 text-sm"
            >
              L'heure doit être entre 09:00 et 18:00
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Notes Supplémentaires</label
          >
          <textarea
            formControlName="additionalNotes"
            rows="3"
            class="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
          ></textarea>
        </div>

        <div class="pt-4 space-y-4">
          <button
            type="submit"

            [disabled]="!collectionForm.valid"
            class="w-full py-3 px-4 rounded-lg  font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all text-sm"
          >
            Soumettre la Demande
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CollectionRequestDialogComponent {
  collectionForm!: FormGroup;
  selectedFiles: File[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  maxFileSize = 5 * 1024 * 1024;
  requestCount$: Observable<number>;
  totalWeight$: Observable<number>;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CollectionRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    private authService: AuthService
  ) {
    this.initForm();
    this.requestCount$ = this.store.pipe(select((state: any) => state.requestCount));
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.fetchRequestCount(user.id);
        this.fetchTotalWeight(user.id);
      }
    });
    this.totalWeight$ = this.store.pipe(select((state: any) => state.collection.totalWeight));
    this.requestCount$ = this.store.pipe(select((state: any) => state.collection.requestCount));
  }
  private initForm(): void {
    this.collectionForm = this.fb.group({
      wasteType: this.fb.group(
        {
          plastique: [false],
          verre: [false],
          papier: [false],
          metal: [false],
        },
        { validators: this.atLeastOneCheckboxCheckedValidator() }
      ),
      estimatedWeight: [1000, [Validators.required, Validators.min(1000)]],
      address: ['', [Validators.required, this.addressValidator]],
      preferredDate: ['', [Validators.required, this.futureDateValidator()]],
      preferredTimeSlot: ['', [Validators.required, this.timeSlotValidator()]],
      additionalNotes: [''],
    });
  }

  private atLeastOneCheckboxCheckedValidator() {
    return (formGroup: FormGroup) => {
      const controls = formGroup.controls;
      const isAtLeastOneChecked = Object.keys(controls).some(
        (key) => controls[key].value
      );
      return isAtLeastOneChecked ? null : { atLeastOneCheckboxChecked: true };
    };
  }

 private futureDateValidator() {
    return (control: AbstractControl) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      return inputDate >= today ? null : { pastDate: true };
    };
  } 

  private timeSlotValidator() {
    return (control: AbstractControl) => {
      const time = control.value;
      const [hours, minutes] = time.split(':').map(Number);
      if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
        return { invalidTimeSlot: true };
      }
      return null;
    };
  }

  private addressValidator(control: AbstractControl) {
    const address = control.value;
    const parts = address.split(',');
    if (parts.length < 3) {
      return { invalidAddress: true };
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.fileError = null;

    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        this.fileError = 'Seules les images JPEG, PNG et WebP sont autorisées';
        return;
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        this.fileError = 'La taille du fichier ne doit pas dépasser 5 Mo';
        return;
      }

      this.selectedFiles = [file];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFiles = [];
    this.imagePreview = null;
    this.fileError = null;
  }

  private fetchRequestCount(userId: string): void {
    this.store.dispatch(CollectionActions.fetchRequestCount({ userId }));
  }
  private fetchTotalWeight(userId: string): void {
    this.store.dispatch(CollectionActions.fetchTotalWeight({ userId }));
  }

  onSubmit(): void {
    console.log('Request count observable:', this.requestCount$);
    this.requestCount$.subscribe(count => {
      console.log('Request count:', count);
      if (count >= 3) {
        Swal.fire({
          icon: 'error',
          title: 'Limit Exceeded',
          text: 'You can only have a maximum of 3 simultaneous requests.',
        });
      } else {
        this.totalWeight$.subscribe(totalWeight => {
          const newRequestWeight = this.collectionForm.get('estimatedWeight')?.value;
          if (totalWeight + newRequestWeight > 10000) {
            Swal.fire({
              icon: 'error',
              title: 'Weight Limit Exceeded',
              text: 'The total weight of your requests cannot exceed 10kg.',
            });
          } else {
            this.submitRequest();
          }
        });
      }
    });
  }

  private submitRequest(): void {
    if (this.collectionForm.valid) {
      const wasteTypeGroup = this.collectionForm.get('wasteType')?.value;
      const selectedWasteTypes = Object.entries(wasteTypeGroup)
        .filter(([_, isSelected]) => isSelected)
        .map(([type]) => type) as ('plastique' | 'verre' | 'papier' | 'metal')[];

      const addressValue = this.collectionForm.get('address')?.value;
      const addressParts = addressValue.split(',');

      const formData: CollectionRequest = {
        wasteType: selectedWasteTypes,
        estimatedWeight: this.collectionForm.get('estimatedWeight')?.value,
        address: {
          street: addressParts[0].trim(),
          postalCode: addressParts[1].trim(),
          city: addressParts[2].trim()
        },
        preferredDate: new Date(this.collectionForm.get('preferredDate')?.value),
        preferredTimeSlot: this.collectionForm.get('preferredTimeSlot')?.value,
        additionalNotes: this.collectionForm.get('additionalNotes')?.value || '',
        status: 'pending',
        photos: this.selectedFiles.map(file => file.name)
      };

      console.log('Transformed request:', formData);
      this.store.dispatch(CollectionActions.createRequest({ request: formData }));

      this.dialogRef.close(formData);
      Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: 'Your collection request has been successfully submitted.',
      });

    } else {
      this.markFormGroupTouched(this.collectionForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
