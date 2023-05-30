
export class User{

    public id: number;
    public firstName: string;
    public lastName: string;
    public phoneNumber: number;
    public email : string;
    public pwd: string;
    public address: string;
    public role : string;
    public statusCd: string;
    public statusMsg : string;
    public authStatus : string;
  
  
    constructor(id?: number,firstName?: string,lastName?: string, phoneNumber?: number, email?: string,  pwd?: string,address?: string,role?: string,
        statusCd?:string,statusMsg?:string, authStatus?:string){
          this.id = id || 0;
          this.firstName = firstName || '';
          this.lastName = lastName || '';
          this.phoneNumber = phoneNumber || 0;
          this.address = address || '';
          this.email = email || '';
          this.pwd = pwd || '';
          this.role = role || '';
          this.statusCd = statusCd || '';
          this.statusMsg = statusMsg || '';
          this.authStatus = authStatus || '';
    }
  
  }