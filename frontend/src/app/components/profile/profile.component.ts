import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  loading = true;
  error = '';
  successMessage = '';
  editMode = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    // Désactiver les champs par défaut
    this.profileForm.disable();
  }

  loadProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm.patchValue({
          email: data.email,
          firstName: data.firstName || '',
          lastName: data.lastName || ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      // Activer les champs en mode édition
      this.profileForm.enable();
      // Pré-remplir avec les valeurs actuelles si disponibles
      this.profileForm.patchValue({
        email: this.user?.email || '',
        firstName: this.user?.firstName || '',
        lastName: this.user?.lastName || ''
      });
    } else {
      // Désactiver les champs et réinitialiser
      this.profileForm.disable();
      this.profileForm.patchValue({
        email: this.user?.email,
        firstName: this.user?.firstName || '',
        lastName: this.user?.lastName || ''
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.successMessage = '';
    this.error = '';

    // Envoyer la requête de mise à jour au backend
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.successMessage = 'Profil mis à jour avec succès !';
        this.editMode = false;
        this.profileForm.disable();
        // Recharger le profil pour afficher les nouvelles données
        this.loadProfile();
      },
      error: (error) => {
        this.error = error.error?.message || 'Erreur lors de la mise à jour du profil';
      }
    });
  }
}
