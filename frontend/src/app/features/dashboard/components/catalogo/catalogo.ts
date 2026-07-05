import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialService } from '../../../../core/services/material.service';
import { AcabadoService } from '../../../../core/services/acabado.service';
import { Acabado, Material } from '../../../../core/models/catalogo.model';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ReactiveFormsModule, HlmButton, HlmInput, HlmLabel],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private fb = inject(FormBuilder);
  private materialService = inject(MaterialService);
  private acabadoService = inject(AcabadoService);
 
  materiales = this.materialService.materiales;
  acabados = this.acabadoService.acabados;
  guardandoMaterial = signal(false);
  guardandoAcabado = signal(false);
 
  formMaterial = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    precioM2: [0, [Validators.required, Validators.min(0.01)]],
    unidad: ['m2', Validators.required]
  });
 
  formAcabado = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    costoFijo: [0, Validators.required],
    costoM2: [0, Validators.required]
  });
 
  ngOnInit() {
    this.cargarMateriales();
    this.cargarAcabados();
  }
 
  cargarMateriales() {
    this.materialService.buscarTodos().subscribe();
  }
 
  cargarAcabados() {
    this.acabadoService.buscarTodos().subscribe();
  }
 
  crearMaterial() {
    if (this.formMaterial.invalid) return;
    this.guardandoMaterial.set(true);
    this.materialService.crear(this.formMaterial.getRawValue()).subscribe({
      next: () => {
        this.guardandoMaterial.set(false);
        this.formMaterial.reset({ nombre: '', precioM2: 0, unidad: 'm2' });
      },
      error: () => this.guardandoMaterial.set(false)
    });
  }
 
  eliminarMaterial(id: number) {
    this.materialService.eliminar(id).subscribe();
  }
 
  crearAcabado() {
    if (this.formAcabado.invalid) return;
    this.guardandoAcabado.set(true);
    this.acabadoService.crear(this.formAcabado.getRawValue()).subscribe({
      next: () => {
        this.guardandoAcabado.set(false);
        this.formAcabado.reset({ nombre: '', costoFijo: 0, costoM2: 0 });
      },
      error: () => this.guardandoAcabado.set(false)
    });
  }
 
  eliminarAcabado(id: number) {
    this.acabadoService.eliminar(id).subscribe();
  }
}
