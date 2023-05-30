import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { ItemList } from 'src/app/models/itemlist.model';
import { Maintenance } from 'src/app/models/maintenance.model';
import { User } from 'src/app/models/user.model';
import { ItemService } from 'src/app/services/item.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-edit-maintenance',
  templateUrl: './edit-maintenance.component.html',
  styleUrls: ['./edit-maintenance.component.css']
})
export class EditMaintenanceComponent implements OnInit {
  maintenanceForm: FormGroup = new FormGroup({});
  itemArray!: FormArray;
  statuses = ['SCHEDULED', 'DONE'];
  user = new User();
  carId!: number
  maintId!:number
  items:Item[]=[];
  maintenance!:Maintenance;

  constructor(private fb: FormBuilder, private maintSvc:MaintenanceService,
    private itemSvc:ItemService,private loadingSvc:LoadingService,
    private activatedRoute:ActivatedRoute, private router:Router) {
      this.maintenanceForm =this.createForm();
    }
  
  async ngOnInit() {
    this.carId = this.activatedRoute.snapshot.queryParams['carId'];
    this.maintId = this.activatedRoute.snapshot.params['id'];
    if(sessionStorage.getItem('userdetails')){
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }

    
    const maintenance$ = this.maintSvc.getMaintenanceById(this.maintId);
    const loadingMaint$ = this.loadingSvc.showLoaderUntilCompleted(maintenance$);
    await firstValueFrom(loadingMaint$).then(result=>{
      this.maintenance = result;
      console.log("maintenance: ",result)
    });

    const itemsInMaint$ = this.itemSvc.getItemsByMaintId(this.maintId)
    const loadingItemsInMaint$ = this.loadingSvc.showLoaderUntilCompleted(itemsInMaint$);
    await firstValueFrom(loadingItemsInMaint$).then(result=>{
      console.log("item in maintenance",result)
      this.maintenance.items = result;
      this.maintenanceForm = this.retrieveForm(this.maintenance);
    });


    const Items$ = this.itemSvc.getAllItems();
    const loadingItems$ = this.loadingSvc.showLoaderUntilCompleted(Items$);
    await firstValueFrom(loadingItems$).then(result=>{
      this.items = result;
    });

  }
  retrieveForm(maint:Maintenance): FormGroup {
    this.itemArray = this.fb.array([]);
    this.retrieveItem(maint.items)
    return this.fb.group({
      id:maint.id,
      description: maint.description,
      date: [maint.date, Validators.required],
      status: [maint.status, Validators.required],
      mileage: [maint.mileage, Validators.required],
      items:this.itemArray
    });
  }
  createForm(): FormGroup {
    this.itemArray = this.fb.array([]);
    return this.fb.group({
      id:null,
      description: null,
      date: [null, Validators.required],
      status: [null, Validators.required],
      mileage: [null, Validators.required],
      items:this.itemArray
    });
  }

  retrieveItem(itemListArray:ItemList[]){
    for(var itemList of itemListArray){
      const item = this.fb.group({
        id:itemList.item.id,
        name:itemList.item.name,
        price: itemList.item.price,
        quantity:itemList.quantity,
      });
      this.itemArray.push(item);
    }
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

  setPrice(selected:any, idx:number){
    const itemId = selected.value
    const priceCtrl = this.itemArray.controls[idx].get('price') as FormControl
    const nameCtrl = this.itemArray.controls[idx].get('name') as FormControl
    const price = this.items.filter(v=>v.id== itemId)[0]['price'];
    const name = this.items.filter(v=>v.id== itemId)[0]['name'];
    priceCtrl.setValue(price);
    nameCtrl.setValue(name);
  }

  removeItem(idx:number){
    // console.log('remove item is clicked'+idx);
    this.itemArray.removeAt(idx);
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
    firstValueFrom(this.maintSvc.updateMaintenance(maintenance)).then(result => {
      alert(`SUCCESSFUL! ${JSON.stringify(result)}`);
      this.router.navigate(['/car',this.carId]);
    })
    .catch(error => {
      alert(`ERROR! ${JSON.stringify(error)}`)
    })
  }
  
}
