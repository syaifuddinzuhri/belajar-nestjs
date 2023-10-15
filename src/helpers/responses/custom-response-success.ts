export class ResponseSuccess {
  constructor(data: any = null, message: string = 'Success') {
    this.status = true;
    this.message = message;
    this.data = data;
  }

  status: boolean;
  message: string;
  data: any;
}
