import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialService } from '../../../../core/services/material.service';
import { AcabadoService } from '../../../../core/services/acabado.service';
import { AcabadoResponse, MaterialResponse } from '../../../../core/models/catalogo.model';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { 
  HlmTableContainer, 
  HlmTable, 
  HlmTHead, 
  HlmTBody, 
  HlmTr, 
  HlmTh, 
  HlmTd 
} from '@spartan-ng/helm/table';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    HlmButton, 
    HlmInput, 
    HlmLabel,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd
  ],
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

  materialEditando = signal<MaterialResponse | null>(null);
  acabadoEditando = signal<AcabadoResponse | null>(null);
 
  formMaterial = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    costoCm2: [0.005, [Validators.required, Validators.min(0.0001)]],
    stockMinimo: [0, [Validators.required, Validators.min(0)]]
  });
 
  formAcabado = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precioBase: [0, [Validators.required, Validators.min(0)]],
    unidadMedida: ['Unidad', Validators.required]
  });

  formEditMaterial = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    costoCm2: [0.005, [Validators.required, Validators.min(0.0001)]],
    stockMinimo: [0, [Validators.required, Validators.min(0)]]
  });

  formEditAcabado = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precioBase: [0, [Validators.required, Validators.min(0)]],
    unidadMedida: ['Unidad', Validators.required]
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

  formatCostoMat(m: MaterialResponse): string {
    const raw = m.costoCm2 ?? (m as any).precioM2 ?? 0;
    return Number(raw).toFixed(4);
  }

  formatPrecioAcab(a: AcabadoResponse): string {
    const raw = a.precioBase ?? (a as any).costoFijo ?? 0;
    return Number(raw).toFixed(2);
  }

  getUnidadAcab(a: AcabadoResponse): string {
    return a.unidadMedida || (a as any).unidad || 'Unidad';
  }
 
  crearMaterial() {
    if (this.formMaterial.invalid) return;
    this.guardandoMaterial.set(true);
    this.materialService.crear(this.formMaterial.getRawValue()).subscribe({
      next: () => {
        this.guardandoMaterial.set(false);
        this.formMaterial.reset({ nombre: '', descripcion: '', costoCm2: 0.005, stockMinimo: 0 });
      },
      error: () => this.guardandoMaterial.set(false)
    });
  }

  abrirEditarMaterial(mat: MaterialResponse) {
    this.materialEditando.set(mat);
    this.formEditMaterial.setValue({
      nombre: mat.nombre || '',
      descripcion: mat.descripcion || '',
      costoCm2: mat.costoCm2 ?? (mat as any).precioM2 ?? 0.005,
      stockMinimo: mat.stockMinimo ?? 0
    });
  }

  guardarEditMaterial() {
    const target = this.materialEditando();
    if (!target || this.formEditMaterial.invalid) return;
    this.guardandoMaterial.set(true);
    this.materialService.actualizar(target.id, this.formEditMaterial.getRawValue()).subscribe({
      next: () => {
        this.guardandoMaterial.set(false);
        this.materialEditando.set(null);
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
        this.formAcabado.reset({ nombre: '', descripcion: '', precioBase: 0, unidadMedida: 'Unidad' });
      },
      error: () => this.guardandoAcabado.set(false)
    });
  }

  abrirEditarAcabado(acab: AcabadoResponse) {
    this.acabadoEditando.set(acab);
    this.formEditAcabado.setValue({
      nombre: acab.nombre || '',
      descripcion: acab.descripcion || '',
      precioBase: acab.precioBase ?? (acab as any).costoFijo ?? 0,
      unidadMedida: acab.unidadMedida || (acab as any).unidad || 'Unidad'
    });
  }

  guardarEditAcabado() {
    const target = this.acabadoEditando();
    if (!target || this.formEditAcabado.invalid) return;
    this.guardandoAcabado.set(true);
    this.acabadoService.actualizar(target.id, this.formEditAcabado.getRawValue()).subscribe({
      next: () => {
        this.guardandoAcabado.set(false);
        this.acabadoEditando.set(null);
      },
      error: () => this.guardandoAcabado.set(false)
    });
  }
 
  eliminarAcabado(id: number) {
    this.acabadoService.eliminar(id).subscribe();
  }
}
