export class ApiResponse {
  public statusCode: number;
  public message: string;
  public data?: any;
  public success: boolean;
  constructor(statusCode: number, message: string = "Success", data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    data && (this.data = data);
    this.success = statusCode < 400;
  }
}
