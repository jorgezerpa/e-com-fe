import { PaymentMethod } from "@/types";

export const COLOR_PRESETS = {
  'BLUE' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'GREEN' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'PURPLE' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'ORANGE' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'RED' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'PINK' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
} as const



export const COMMON_PAYMENT_METHODS_PAGO_MOVIL: PaymentMethod[] = [
  // --- PAGO MOVIL ---
  {
    "name": "Pago Movil Banco de Venezuela (BDV)",
    "description": "",
    "provider": "Banco de Venezuela (BDV)",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banesco Banco Universal",
    "description": "",
    "provider": "Banesco Banco Universal",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Mercantil",
    "description": "",
    "provider": "Banco Mercantil",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil BBVA Provincial",
    "description": "",
    "provider": "BBVA Provincial",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Nacional de Crédito (BNC)",
    "description": "",
    "provider": "Banco Nacional de Crédito (BNC)",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Bancaribe",
    "description": "",
    "provider": "Bancaribe",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Fondo Común (BFC)",
    "description": "",
    "provider": "Banco Fondo Común (BFC)",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Exterior",
    "description": "",
    "provider": "Banco Exterior",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banplus Banco Universal",
    "description": "",
    "provider": "Banplus Banco Universal",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Bancamiga Banco Universal",
    "description": "",
    "provider": "Bancamiga Banco Universal",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco del Tesoro",
    "description": "",
    "provider": "Banco del Tesoro",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Plaza",
    "description": "",
    "provider": "Banco Plaza",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Delsur Banco Universal",
    "description": "",
    "provider": "Delsur Banco Universal",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Caroní",
    "description": "",
    "provider": "Banco Caroní",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Sofitasa",
    "description": "",
    "provider": "Banco Sofitasa",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Activo",
    "description": "",
    "provider": "Banco Activo",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil 100% Banco",
    "description": "",
    "provider": "100% Banco",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Venezolano de Crédito (BVC)",
    "description": "",
    "provider": "Banco Venezolano de Crédito (BVC)",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banfanb (Banco de la Fuerza Armada)",
    "description": "",
    "provider": "Banfanb (Banco de la Fuerza Armada)",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Pago Movil Banco Digital de los Trabajadores (anteriormente Bicentenario)",
    "description": "",
    "provider": "Banco Digital de los Trabajadores (anteriormente Bicentenario)",
    "receiverFields": {
      "Banco": "",
      "Cedula": "",
      "telefono": "",
      "nombre del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  }
];


export const COMMON_PAYMENT_METHODS_BANK_TRANSFER = [
    // --- TRANSFERENCIA BANCARIA ---
  {
    "name": "Transferencia Bancaria Banco de Venezuela (BDV)",
    "description": "",
    "provider": "Banco de Venezuela (BDV)",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banesco Banco Universal",
    "description": "",
    "provider": "Banesco Banco Universal",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Mercantil",
    "description": "",
    "provider": "Banco Mercantil",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria BBVA Provincial",
    "description": "",
    "provider": "BBVA Provincial",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Nacional de Crédito (BNC)",
    "description": "",
    "provider": "Banco Nacional de Crédito (BNC)",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Bancaribe",
    "description": "",
    "provider": "Bancaribe",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Fondo Común (BFC)",
    "description": "",
    "provider": "Banco Fondo Común (BFC)",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Exterior",
    "description": "",
    "provider": "Banco Exterior",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banplus Banco Universal",
    "description": "",
    "provider": "Banplus Banco Universal",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Bancamiga Banco Universal",
    "description": "",
    "provider": "Bancamiga Banco Universal",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco del Tesoro",
    "description": "",
    "provider": "Banco del Tesoro",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Plaza",
    "description": "",
    "provider": "Banco Plaza",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Delsur Banco Universal",
    "description": "",
    "provider": "Delsur Banco Universal",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Caroní",
    "description": "",
    "provider": "Banco Caroní",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Sofitasa",
    "description": "",
    "provider": "Banco Sofitasa",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Activo",
    "description": "",
    "provider": "Banco Activo",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria 100% Banco",
    "description": "",
    "provider": "100% Banco",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Venezolano de Crédito (BVC)",
    "description": "",
    "provider": "Banco Venezolano de Crédito (BVC)",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banfanb (Banco de la Fuerza Armada)",
    "description": "",
    "provider": "Banfanb (Banco de la Fuerza Armada)",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  },
  {
    "name": "Transferencia Bancaria Banco Digital de los Trabajadores (anteriormente Bicentenario)",
    "description": "",
    "provider": "Banco Digital de los Trabajadores (anteriormente Bicentenario)",
    "receiverFields": {
      "Numero de cuenta": "",
      "Nombre del titular": "",
      "cedula del titular": ""
    },
    "fields": {
      "Numero de Referencia": "Numero de identificacion/referencia del pago"
    },
    
    "askForPaymentProofImage": true
  }
]

export const COMMON_SHIPPING_METHODS = [
  {
    "name": "MRW",
    "description": "Envio gratis por MRW",
    "provider": "MRW",
    "fields": {
      "Nombres del receptor": "",
      "Apellidos del receptor": "",
      "Cedula del receptor": "",
      "Celular del receptor": "",
      "Correo del receptor": "",
      "código y/o direccion de agencia de destino": ""
    },
  },
  {
    "name": "Zoom",
    "description": "Envio gratis por Zoom",
    "provider": "MRW",
    "fields": {
      "Nombres del receptor": "",
      "Apellidos del receptor": "",
      "Cedula del receptor": "",
      "Celular del receptor": "",
      "Correo del receptor": "",
      "código y/o direccion de agencia de destino": ""
    },
  }
]