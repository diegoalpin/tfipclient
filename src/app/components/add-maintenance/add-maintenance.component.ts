import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'jquery';
import { firstValueFrom } from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { ItemList } from 'src/app/models/itemlist.model';
import { Maintenance } from 'src/app/models/maintenance.model';
import { User } from 'src/app/models/user.model';
import { ItemService } from 'src/app/services/item.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.css'],
})
export class AddMaintenanceComponent implements OnInit {
  maintenanceForm!: FormGroup;
  itemArray!: FormArray;
  // addressForm = this.fb.group({
  //   description: null,
  //   date: [null, Validators.required],
  //   status: [null, Validators.required],
  //   mileage: [null, Validators.required],

  //   // lastName: [null, Validators.required],
  //   // address: [null, Validators.required],
  //   // address2: null,
  //   // city: [null, Validators.required],
  //   // postalCode: [null, Validators.compose([
  //   //   Validators.required, Validators.minLength(5), Validators.maxLength(5)])
  //   // ],
  //   // shipping: ['free', Validators.required]
  // });

  statuses = ['SCHEDULED', 'DONE'];
  user = new User();
  carId!: number
  items:Item[]=[];

  constructor(private fb: FormBuilder, private maintSvc:MaintenanceService,
              private itemSvc:ItemService,private loadingSvc:LoadingService,
              private activatedRoute:ActivatedRoute, private router:Router) {}

  async ngOnInit() {
    this.carId = this.activatedRoute.snapshot.queryParams['carId'];
    if(sessionStorage.getItem('userdetails')){
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }

    this.maintenanceForm = this.createForm();
    
    const Items$ = this.itemSvc.getAllItems();
    const loadingItems$ = this.loadingSvc.showLoaderUntilCompleted(Items$)
    await firstValueFrom(loadingItems$).then(result=>{
      this.items = result;
    })
  }

  createForm(): FormGroup {
    this.itemArray = this.fb.array([]);
    this.addItem();
    return this.fb.group({
      description: null,
      date: [null, Validators.required],
      status: [null, Validators.required],
      mileage: [null, Validators.required],
      items:this.itemArray
    });
  }

  addItem(){
    const item = this.fb.group({
      id:null,
      name:null,
      price: null,
      quantity:null,
    });
    this.itemArray.push(item);
    
  }

  removeItem(idx:number){
    console.log('remove item is clicked'+idx);
    this.itemArray.removeAt(idx);
  }
  setPrice(selected:any, idx:number){
    const itemId = selected.value
    const priceCtrl = this.itemArray.controls[idx].get('price') as FormControl
    const nameCtrl = this.itemArray.controls[idx].get('name') as FormControl
    const price = this.items.filter(v=>v.id== itemId)[0]['price'];
    const name = this.items.filter(v=>v.id== itemId)[0]['name'];
    priceCtrl.setValue(price);
    nameCtrl.setValue(name);
  }

  onSubmit(): void {
    const maintenance: Maintenance = this.maintenanceForm.value;
    const itemValues:Item[] = this.itemArray.getRawValue()
    console.log(itemValues);
    var itemListArray:ItemList[]=[];
    
    for (const itemrow of itemValues){
        const item:Item = {
          id:itemrow.id,
          name:itemrow.name,
          price:itemrow.price
        }
        const itemList:ItemList={
          item:item,
          quantity:itemrow.quantity
        }
        console.log(item,itemList)
        itemListArray.push(itemList);
    }
    maintenance.items = itemListArray;
    console.log(maintenance);
    firstValueFrom(this.maintSvc.createMaintenance(maintenance,this.carId)).then(result => {
      alert(`SUCCESSFUL! ${JSON.stringify(result)}`);
      this.router.navigate(['/car',this.carId]);
    })
    .catch(error => {
      alert(`ERROR! ${JSON.stringify(error)}`)
    })
  }
}
