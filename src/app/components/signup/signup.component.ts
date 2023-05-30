import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent  implements OnInit{
  regForm!:FormGroup
  pwdExact!:boolean
  visible:boolean = true;
  changetype:boolean =true;
  visibleRepeat: boolean=true;
  changetypeRepeat: boolean=true;

  constructor(private fb:FormBuilder, private userSvc:UserService,
              private router:Router){}
  
  ngOnInit(): void {
    this.regForm = this.createForm();
  }
  createForm():FormGroup {
    return this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required,Validators.email]],
      pwd: [null, [Validators.required,Validators.minLength(5)]],
      repeatPwd: [null, [Validators.required,Validators.minLength(5)]],
      address: [null, Validators.required],
      phoneNumber: [null, Validators.required]
    });
  }
  isControlInvalid(ctrlName: string): boolean {
    const ctrl = this.regForm.get(ctrlName) as FormControl
    if(ctrlName=='pwd'||ctrlName=='repeatPwd'){
      // console.log(ctrlName)
      // console.log("not pristine",!ctrl.pristine);
      // console.log("invalid",ctrl.invalid);
      // console.log("not exact",!this.checkPwdExact());

      return (!ctrl.pristine) && (ctrl.invalid || !this.checkPwdExact())
    }
    return ctrl.invalid && (!ctrl.pristine)
  }

  checkPwdExact():boolean{
    const pwd: string = this.regForm.get('pwd')?.value
    const repeatPwd: string = this.regForm.get('repeatPwd')?.value
  
    return (pwd===repeatPwd)
  }

  async onSubmit() {
    const user : User = new User()
    user.address = this.regForm.get('address')?.value.trim()
    user.email = this.regForm.get('email')?.value.trim()
    user.firstName = this.regForm.get('firstName')?.value.trim() 
    user.lastName = this.regForm.get('lastName')?.value.trim()
    user.phoneNumber = this.regForm.get('phoneNumber')?.value 
    user.pwd = this.regForm.get('pwd')?.value.trim()
    console.log(user)
    await firstValueFrom(this.userSvc.createUser(user)).then(response=>{
      alert(response);
      this.router.navigate(['/login']);
    })
  }
  viewPassPwd(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  viewPassRepeat(){
    this.visibleRepeat = !this.visibleRepeat;
    this.changetypeRepeat = !this.changetypeRepeat;
  }
}
