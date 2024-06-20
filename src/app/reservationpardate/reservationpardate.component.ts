import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservationpardate',
  templateUrl: './reservationpardate.component.html',
  styleUrls: ['./reservationpardate.component.css']
})
export class ReservationpardateComponent implements OnInit {

  searchTerm: string = '';
  reservationForm: FormGroup;
  submitted = false;
  selectedBienId: any;
  selectedEquipment: any[] = [];
  availableBiens: any[] = [];
  filteredBiens: any[] = [];
  selectedBien: any;
  categories: any[] = [];
  subCategories: any[] = [];
  departments: any[] = [];
  selectedSubCategories: { [key: number]: boolean } = {};
  reservationList: any[] = [];
  selectedCategory: any;
  selectedSouscategory: any;
  selectedDepartment: any;
  filteredSouscategories: any[] = [];
  selectedBiens: Set<number> = new Set();

  @ViewChild('selectedEquipmentTable') selectedEquipmentTable!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.reservationForm = this.fb.group({
      reservationStartDate: ['', [Validators.required, this.futureDateValidator(), this.businessHoursValidator(), this.tunisianHolidaysValidator()]],
      reservationEndDate: ['', [Validators.required, this.futureDateValidator(), this.businessHoursValidator(), this.tunisianHolidaysValidator()]]
    }, { validator: this.startBeforeEndValidator });
  }

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadAllSubCategories();
    this.loadAllDepartment();
  }


  loadAllCategories(): void {
    this.sharedService.getAllCategories().subscribe(
      res => {
        this.categories = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  loadAllSubCategories(): void {
    this.sharedService.getAllSubcategories().subscribe(
      res => {
        this.subCategories = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  loadAllDepartment(): void {
    this.sharedService.getAllDepartments().subscribe(
      res => {
        this.departments = res;
        console.log('departments',this.departments )
      },
      err => {
        console.error(err);
      }
    );
  }


  filterByDepartment(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value === 'all') {
      this.selectedDepartment = 'all';
      this.filteredBiens = this.availableBiens;
      console.log('filteredBiens ',this.filteredBiens )
    } else {
      const departmentId = +value;
      this.selectedDepartment = this.departments.find(department => department.id === departmentId);
      console.log( ' this.selectedDepartment',this.selectedDepartment);
      if (this.selectedDepartment) {
        this.filteredBiens = this.availableBiens.filter(bien => bien.departement && bien.departement.id === this.selectedDepartment.id);
      } else {
        this.filteredBiens = this.availableBiens;
      }
      console.log( ' this.filteredBiens ',this.filteredBiens );
    }
  }
  

  filterByCategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value === 'all') {
      this.selectedCategory = 'all';
      this.filteredBiens = this.availableBiens;
      this.filteredSouscategories = this.subCategories;
    } else {
      const categoryId = +value;
      this.selectedCategory = this.categories.find(cat => cat.id === categoryId);
      if (this.selectedCategory) {
        this.filteredBiens = this.availableBiens.filter(bien => bien.categorie && bien.categorie.id === this.selectedCategory.id);
        this.filteredSouscategories = this.subCategories.filter(subcategory => subcategory.categorie && subcategory.categorie.id === this.selectedCategory.id);
      } else {
        this.filteredBiens = this.availableBiens;
        this.filteredSouscategories = this.subCategories;
      }
    }
  }

  filterBySubcategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value === 'all') {
      this.selectedSouscategory = 'all';
      if (this.selectedCategory && this.selectedCategory !== 'all') {
        this.filteredBiens = this.availableBiens.filter(bien => bien.categorie && bien.categorie.id === this.selectedCategory.id);
      } else {
        this.filteredBiens = this.availableBiens;
      }
    } else {
      const subcategoryId = +value;
      this.selectedSouscategory = this.filteredSouscategories.find(sub => sub.id === subcategoryId);
      if (this.selectedSouscategory) {
        this.filteredBiens = this.availableBiens.filter(bien => bien.sousCategorie && bien.sousCategorie.id === this.selectedSouscategory.id);
      } else if (this.selectedCategory && this.selectedCategory !== 'all') {
      
        this.filterByCategory({ target: { value: this.selectedCategory.id.toString() } } as any);
      } else {
        this.filteredBiens = this.availableBiens;
      }
    }
  }


  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredBiens = this.availableBiens;
    } else {
      this.filteredBiens = this.availableBiens.filter((bien: any) =>
        (bien.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (bien.sousCategorie.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (bien.categorie.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (bien.departement.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  onDateChange(): void {
    if (this.reservationForm.valid) {
      const { reservationStartDate, reservationEndDate } = this.reservationForm.value;
      this.sharedService.getAvailableEquipment(reservationStartDate, reservationEndDate).subscribe((biens: any[]) => {
        this.availableBiens = biens;
        this.filteredBiens = biens;
        console.log("availableBiens", this.availableBiens);
      });
    }
  }


  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substr(0, maxLength) + '...';
    }
    return text;
  }

  selectBienn(bien: any) {
    this.selectedBien = bien;
  }
  selectBien(bienId: any) {
    this.selectedBienId = bienId;
    console.log('selectedBienId',this.selectedBienId);
  }


  addToReservation(bien: any) {
    if (!this.selectedBiens.has(bien.id)) {
      this.reservationList.push(bien);
      this.selectedBiens.add(bien.id);
      this.scrollToTable();
    } else {
      alert('This equipment is already added to the reservation.');
    }
  }

  removeFromReservation(bien: any) {
    this.reservationList = this.reservationList.filter(item => item !== bien);
    this.selectedBiens.delete(bien.id);
  }


  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const date = new Date(control.value);
      const today = new Date();
      if (date <= today) {
        return { futureDate: true };
      }
      return null;
    };
  }

  businessHoursValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const date = new Date(control.value);
      const hours = date.getHours();
      if (hours < 8 || hours > 18) {
        return { businessHours: true };
      }
      return null;
    };
  }

  tunisianHolidaysValidator(): ValidatorFn {
    const holidays = [
      '2024-01-01', // New Year's Day
      '2024-03-20', // Independence Day
      '2024-04-09', // Martyrs' Day
      '2024-05-01', // Labour Day
      '2024-07-25', // Republic Day
      '2024-08-13', // Women's Day
      '2024-10-15', // Evacuation Day
      '2024-04-21', '2024-04-22', // Eid al-Fitr
      '2024-07-28', '2024-07-29' // Eid al-Adha
    ];
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }

      const date = new Date(control.value);
      if (isNaN(date.getTime())) {
        return null;
      }

      const dateString = date.toISOString().split('T')[0];
      if (holidays.includes(dateString)) {
        return { holidayDate: true };
      }

      return null;
    };
  }

  startBeforeEndValidator(group: FormGroup): { [key: string]: any } | null {
    const start = group.controls['reservationStartDate'].value;
    const end = group.controls['reservationEndDate'].value;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (startDate.getTime() === endDate.getTime()) {
        return { sameStartEndTime: true };
      }

      if (startDate >= endDate) {
        return { startBeforeEnd: true };
      }

      const differenceInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      if (differenceInHours < 1) {
        return { minimumOneHour: true };
      }
    }
    return null;
  }

  scrollToTable() {
    setTimeout(() => {
      this.selectedEquipmentTable.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reservationForm.invalid) {
      return;
    }

    const userId = localStorage.getItem('id');
    console.log("userId", userId);

    const startDate = new Date(this.reservationForm.value.reservationStartDate).toISOString();
    const endDate = new Date(this.reservationForm.value.reservationEndDate).toISOString();

    const reservationData = {
      bienIds: Array.from(this.selectedBiens).map(String),
      date_debut: startDate,
      date_fin: endDate,
      userId: userId,
    };

    console.log(reservationData);

    this.sharedService.addReservation(reservationData).subscribe(
      response => {
        alert('Reservation successful!');
        this.submitted = false;
        this.reservationForm.reset();
        this.router.navigate(['/reservations']);
      },
      error => {
        console.error('Error adding reservation:', error);
        alert('Reservation failed. Please try again.');
      }
    );
  }

  onCancel(): void {
    this.reservationForm.reset();
    this.reservationList = [];
    this.selectedBiens.clear();
    this.submitted = false;
  }


}
