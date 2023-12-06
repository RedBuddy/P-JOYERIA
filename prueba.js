function generateInvoiceData(invoiceNumber, paymentDate, items) {
  return {
    label: "Invoice #: ",
    num: invoiceNumber,
    invDate: "Payment Date: " + paymentDate,
    invGenDate: "Invoice Date: " + getCurrentDate(),
    headerBorder: false,
    tableBodyBorder: false,
    header: [
      { title: "#", style: { width: 10 } },
      { title: "Title", style: { width: 30 } },
      { title: "Price" },
      { title: "Quantity" },
      { title: "Total" },
    ],
    table: items.map((item, index) => [
      index + 1,
      item.NOMBRE_PRODUCTO || item.title, // Use appropriate property for title
      item.PRECIO_VENTA || item.price,
      item.CANTIDAD || item.quantity,
      item.TOTAL || item.total,
    ]),
    // ... other dynamic properties
  };
}

// Example data for the invoice
var invoiceNumber = 19;
var paymentDate = "01/01/2021 18:12";
var apiResult = [
  {
    "ID_VENTA": 133,
    "ID_PRODUCTO_TERMINADO": 17,
    "NOMBRE_PRODUCTO": "Collar de perlas",
    "PRECIO_VENTA": 1500,
    "CANTIDAD": 14,
    "TOTAL": 21000
  },
  {
    "ID_VENTA": 133,
    "ID_PRODUCTO_TERMINADO": 18,
    "NOMBRE_PRODUCTO": "Collar de dijes de León",
    "PRECIO_VENTA": 1500,
    "CANTIDAD": 20,
    "TOTAL": 30000
  }
];

// Transform the array of objects to match the expected structure
var items = apiResult.map((resultItem) => ({
  title: resultItem.NOMBRE_PRODUCTO,
  price: resultItem.PRECIO_VENTA,
  quantity: resultItem.CANTIDAD,
  total: resultItem.TOTAL,
}));

// Generate dynamic invoice data
var dynamicInvoice = generateInvoiceData(invoiceNumber, paymentDate, items);

// Generate dynamic invoice data


// Assuming you have a function to get the current date
function getCurrentDate() {
  var currentDate = new Date();
  var formattedDate = currentDate.toLocaleDateString();
  return formattedDate;
}


// Merge with the rest of your props
var props = {
  outputType: jsPDFInvoiceTemplate.OutputType.Save,
  returnJsPDFDocObject: true,
  fileName: "Facutra 2023",
  orientationLandscape: false,
  compress: true,
  logo: {
    src: "logo.jpg",
    type: 'PNG', //optional, when src= data:uri (nodejs case)
    width: 53.33, //aspect ratio = width/height
    height: 26.66,
    margin: {
      top: 0, //negative or positive num, from the current position
      left: 0 //negative or positive num, from the current position
    }
  },
  stamp: {
    inAllPages: true, //by default = false, just in the last page
    src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
    type: 'JPG', //optional, when src= data:uri (nodejs case)
    width: 20, //aspect ratio = width/height
    height: 20,
    margin: {
      top: 0, //negative or positive num, from the current position
      left: 0 //negative or positive num, from the current position
    }
  },
  business: {
    name: "Zhoe Parodi",
    address: "Fraccionamiento Estrella",
    phone: "6681930210",
    email: "zhoeparodi@gmail.com",
  },
  contact: {
    label: "Factura para:",//todo esta seran los campos del cliente
    name: "Client Name",
    address: "Albania, Tirane, Astir",
    phone: "(+355) 069 22 22 222",
    email: "client@website.al",
    otherInfo: "www.website.al",
  },
  invoice: dynamicInvoice,
  footer: {
    text: "The invoice is created on a computer and is valid without the signature and stamp.",
  },
  pageEnable: true,
  pageLabel: "Page ",
};

function generatePDF() {

  //or in browser
  var pdfObject = jsPDFInvoiceTemplate.default(props);
}

// function getCurrentDate() {
//   var currentDate = new Date();
//   var formattedDate = currentDate.toLocaleDateString();
//   return formattedDate;
// }