import { Client } from "./client.model";

export class Request {
  requestId: string;
  requestDate: Date;
  time: string;
  remarks: string;
  isCancelledByAdmin: boolean;
  adminRemarks: string;
  client: Client;
  requestType: RequestType;
  requestStatus: RequestStatus;
}

export class RequestStatus {
  requestStatusId: string;
  name: string;
}

export class RequestType {
  requestTypeId: string;
  name: string;
}