import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as CollectionActions from '../../../state/actions/collectionReq.actions';
import { CollectionRequest } from '../../../core/models/CollectionRequest.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collector-req-edit-modal',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  template: `
  <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-screen relative">
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
      [formGroup]="editForm"
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
        <label class="block text-sm font-medium text-gray-700">Type de Déchet</label>
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
          *ngIf="editForm.get('wasteType')?.invalid && editForm.get('wasteType')?.touched"
          class="text-red-600 text-sm"
        >
          Au moins un type de déchet est requis
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Poids estimé (minimum 1000g obligatoire)</label>
        <input
          type="number"
          formControlName="estimatedWeight"
          class="mt-1 px-3 py-2 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
        />
        <div
          *ngIf="editForm.get('estimatedWeight')?.invalid && editForm.get('estimatedWeight')?.touched"
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
          *ngIf="editForm.get('address')?.invalid && editForm.get('address')?.touched"
          class="text-red-600 text-sm"
        >
          L'adresse doit contenir la rue, le code postal et la ville
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Date Préférée</label>
          <input
            type="date"
            formControlName="preferredDate"
            class="mt-1 px-3 py-2 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
          />
          <div
            *ngIf="editForm.get('preferredDate')?.invalid && editForm.get('preferredDate')?.touched"
            class="text-red-600 text-sm"
          >
            Une date future valide est requise
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Heure Préférée</label>
          <input
            type="time"
            formControlName="preferredTimeSlot"
            class="mt-1 px-3 py-2 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
          />
          <div
            *ngIf="editForm.get('preferredTimeSlot')?.invalid && editForm.get('preferredTimeSlot')?.touched"
            class="text-red-600 text-sm"
          >
            L'heure doit être entre 09:00 et 18:00
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Notes Supplémentaires</label>
        <textarea
          formControlName="additionalNotes"
          rows="3"
          class="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-0 text-sm"
        ></textarea>
      </div>

      <div class="pt-4 space-y-4">
        <button
          type="submit"
          [disabled]="!editForm.valid"
          class="w-full py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all text-sm"
        >
          Mettre à jour la Demande
        </button>
      </div>
    </form>
  </div>
  `,
})
export class CollectorReqEditModalComponent implements OnInit {
  editForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  maxFileSize = 5 * 1024 * 1024;

  constructor(
    public dialogRef: MatDialogRef<CollectorReqEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: CollectionRequest },
    private fb: FormBuilder,
    private store: Store
  ) {
    console.log('Received data:', this.data); // Debugging

    const requestData = this.data.request;
    const wasteType = requestData.wasteType || [];
    const preferredDate = requestData.preferredDate ? new Date(requestData.preferredDate).toISOString().split('T')[0] : null;
    const preferredTimeSlot = requestData.preferredTimeSlot || '';
    const address = requestData.address || { street: '', postalCode: '', city: '' };

    this.editForm = this.fb.group({
      wasteType: this.fb.group({
        plastique: [wasteType.includes('plastique')],
        verre: [wasteType.includes('verre')],
        papier: [wasteType.includes('papier')],
        metal: [wasteType.includes('metal')],
      }),
      estimatedWeight: [requestData.estimatedWeight || '', [Validators.required, Validators.min(1000)]],
      address: [this.formatAddress(address), [Validators.required, Validators.minLength(5), this.addressValidator]],
      preferredDate: [preferredDate, [Validators.required, this.futureDateValidator()]],
      preferredTimeSlot: [preferredTimeSlot, [Validators.required, this.timeSlotValidator()]],
      additionalNotes: [requestData.additionalNotes || '']
    });
  }

  ngOnInit(): void {}

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
      if (!time) {
        return { invalidTimeSlot: true };
      }
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

  private formatAddress(address: { street: string; postalCode: string; city: string }): string {
    return `${address.street}, ${address.postalCode}, ${address.city}`;
  }

  private formatDate(date: Date | null): string {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    const d = new Date(date);
    return d.toISOString().split('T')[0];
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

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.fileError = null;
  }
  onSubmit(): void {
    if (this.editForm.valid) {
      const wasteTypeGroup = this.editForm.get('wasteType')?.value;
      const selectedWasteTypes = Object.entries(wasteTypeGroup)
        .filter(([_, isSelected]) => isSelected)
        .map(([type]) => type) as ('plastique' | 'verre' | 'papier' | 'metal')[];

      const addressValue = this.editForm.get('address')?.value;
      const addressParts = addressValue.split(',');

      const formData: CollectionRequest = {
        ...this.data.request,
        wasteType: selectedWasteTypes,
        estimatedWeight: this.editForm.get('estimatedWeight')?.value,
        address: {
          street: addressParts[0].trim(),
          postalCode: addressParts[1].trim(),
          city: addressParts[2].trim()
        },
        preferredDate: new Date(this.editForm.get('preferredDate')?.value),
        preferredTimeSlot: this.editForm.get('preferredTimeSlot')?.value,
        additionalNotes: this.editForm.get('additionalNotes')?.value || '',
        status: 'pending'
      };

      this.store.dispatch(CollectionActions.updateRequest({ request: formData }));
      this.dialogRef.close(formData);
      Swal.fire({
        icon: 'success',
        title: 'Demande mise à jour',
        text: 'Votre demande a été mise à jour avec succès.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    } else {
      this.markFormGroupTouched(this.editForm);
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
