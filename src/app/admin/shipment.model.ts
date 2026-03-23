export interface Shipment {
  id?: number;
  warehouseBlock: string;
  modeOfShipment: string;
  status: string;
  order?: any;
}
