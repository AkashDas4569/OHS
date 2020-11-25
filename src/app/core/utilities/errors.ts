export interface ErrorsInterface {
  [key: string]: {
    type: string;
    message: string;
  }[]
}
export const Errors: ErrorsInterface = {
  username: [
    { type: 'required', message: 'User Id is required.' },
    { type: 'pattern', message: 'No empty space is allowed.' },
  ],
  clinicName: [
    { type: 'required', message: 'Clinic Name is required.' },
  ],
  client: [
    { type: 'required', message: 'Company is required.' },
  ],
  child: [
    { type: 'pattern', message: 'Only numbers are allowed.' },
    { type: 'maxlength', message: 'Should not be more than 3 digits.' }
  ],
  yearsMarried: [
    { type: 'pattern', message: 'Only numbers are allowed.' },
    { type: 'maxlength', message: 'Should not be more than 3 digits.' }
  ],
  Relationship: [
    { type: 'required', message: 'Relationship is required.' },
  ],
  errorMsg: [
    { type: 'required', message: 'Field should not be empty.' },
  ],
  fax: [
    { type: 'required', message: 'Fax Number is required.' },
    { type: 'pattern', message: 'Only numbers are allowed' },
    { type: 'minlength', message: 'Must be 8 or more than 8 characters.' },
    { type: 'maxlength', message: 'Should not be more than 12 characters.' }
  ],
  mmcNo: [
    { type: 'required', message: 'MMC Number is required.' },
    { type: 'pattern', message: 'Only numbers are allowed' },
    { type: 'minlength', message: 'Must be 10 or more than 10 characters.' },
    { type: 'maxlength', message: 'Should not be more than 14 characters.' }
  ],
  DOSHRegNumber: [
    { type: 'required', message: 'DOSH Reg. Number is required.' },
    { type: 'pattern', message: 'Only numbers are allowed' },
    { type: 'minlength', message: 'Must be 10 or more than 10 characters.' },
    { type: 'maxlength', message: 'Should not be more than 14 characters.' }
  ],
  password: [
    { type: 'required', message: 'Password is required.' },
    { type: 'pattern', message: 'Please enter a valid Password.' },
    { type: 'minlength', message: 'Must be more than 4 characters.' }
  ],
  employeeName: [
    { type: 'required', message: 'Employee Name is required.' },
    { type: 'pattern', message: 'No empty space is allowed.' },
  ],
  doctorName: [
    { type: 'required', message: 'Doctor Name is required.' },
    { type: 'pattern', message: 'No empty space is allowed.' },
  ],
  TelNo: [
    { type: 'required', message: 'Telephone Number is required.' },
    { type: 'minlength', message: 'Telephone Number must be minimum 9 characters' },
    { type: 'maxlength', message: 'Telephone Number must be maximum 13 characters' },
    { type: 'pattern', message: 'Only numbers are allowed.' },
  ],
  myKad: [
    { type: 'required', message: 'IC Number is required.' },
    { type: 'pattern', message: 'Please enter a valid IC Number.' },
    { type: 'minlength', message: 'Must be 10 or more than 10 characters.' },
    { type: 'maxlength', message: 'Should not be more than 14 characters.' }
  ],
  notes: [
    { type: 'required', message: 'Field should not be empty.' },
    { type: 'maxlength', message: 'Field should be of 120 characters.' }
  ],
  qualification: [
    { type: 'required', message: 'Doctor Qualification is required.' },
    { type: 'pattern', message: 'Only alphabet Characters with comma(,) are allowed.' },
  ],
  appointmentDate: [
    { type: 'required', message: 'Appointment Date is required.' }
  ],
  fromDate: [
    { type: 'required', message: 'Date is required.' }
  ],
  strength: [
    { type: 'required', message: 'Drug Strength is required.'}
  ],
  toDate: [
    { type: 'required', message: 'Date is required.' }
  ],
  panelInsName: [
    { type: 'required', message: 'Panel name is required.' }
  ],
  city: [
    { type: 'required', message: 'City is required.' }
  ],
  state: [
    { type: 'required', message: 'State is required.' }
  ],
  street: [
    { type: 'required', message: 'Street is required.' }
  ],
  pin: [
    { type: 'required', message: 'Postal Code is required.' },
    { type: 'pattern', message: 'Please enter a valid Postal Code.' },
    { type: 'minlength', message: 'Must be 6 or more than 6 characters.' },
    { type: 'maxlength', message: 'Should not be more than 10 characters.' }
  ],
  contactPersonName: [
    { type: 'required', message: 'Name is required.' },
    { type: 'pattern', message: 'No empty space and any number is allowed.' },
  ],
  companyName: [
    { type: 'required', message: 'Name is required.' },
    { type: 'pattern', message: 'No empty space is allowed.' },
  ],
  ContactMobile: [
    { type: 'required', message: 'Contact Number is required.' },
    { type: 'pattern', message: 'Please enter a valid Contact Number.' },
    { type: 'minlength', message: 'Must be 10 or more than 10 characters.' },
    { type: 'maxlength', message: 'Should not be more than 14 characters.' }
  ],
  ContactOffice: [
    { type: 'pattern', message: 'Please enter a valid Office Number.' },
    { type: 'minlength', message: 'Must be 9 or more than 9 characters.' },
    { type: 'maxlength', message: 'Should not be more than 13 characters.' }
  ],
  Industry: [
    { type: 'required', message: 'Industry is required.' }
  ],
  Designation: [
    { type: 'required', message: 'Designation is required.' },
    { type: 'pattern', message: 'No empty space and any number is allowed.' },
  ],
  mobile: [
    { type: 'required', message: 'Mobile Number is required.' },
    { type: 'pattern', message: 'Please enter a valid Mobile Number.' },
    { type: 'minlength', message: 'Must be 10 or more than 10 characters.' },
    { type: 'maxlength', message: 'Should not be more than 14 characters.' }
  ],
  email: [
    { type: 'required', message: 'Email is required.' },
    { type: 'email', message: 'Please enter a valid Email Address.' },
  ],
  remarks: [
    { type: 'required', message: 'Field should not be empty.' },
    { type: 'maxlength', message: 'Description should be of 120 characters.' }
  ],
  urlVerification: [
    { type: 'maxlength', message: 'Field should not be more than 70 characters.' },
    { type: 'pattern', message: 'Please enter a valid URL.' }
  ],
  allowedPerVisit: [
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  allowedMonthlyLimit: [
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  allowedYearlyLimit: [
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  processingDays: [
    { type: 'required', message: 'Field should not be empty.' },
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  verificationMethod: [
    { type: 'maxlength', message: 'Should not be more than 10 characters.' }
  ],
  claimProcessingDays: [
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  claimProcessDayOfMonth: [
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  priceType: [
    { type: 'required', message: 'Price Type is required.' }
  ],
  Dosage: [
    { type: 'pattern', message: 'Dosage should be number only.' }
  ],
  rxQty: [
    { type: 'pattern', message: 'Rx Qty. should be number only.' }
  ],
  consultationFee: [
    { type: 'required', message: 'Field should not be empty.' },
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  date: [
    { type: 'required', message: 'Date is required.' }
  ],
  name: [
    { type: 'required', message: 'Name is required.' },
    { type: 'pattern', message: 'No empty space is allowed.' }
  ],
  expenseTypeID:[
    { type: 'required', message: 'Expense Type is required.' }
  ],
  amount:[
    { type: 'required', message: 'Amount is required.' },
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  expenseDesc:[
    // { type: 'required', message: 'Description is required.' }
    { type: 'maxlength', message: 'Description should not be more than 120 characters.' }

  ],
  depositDt:[
    { type: 'required', message: 'Date is required.' }
  ],
  depositAmount:[
    { type: 'required', message: 'Deposit Amount is required.' },
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  acctNo:[
    { type: 'required', message: 'Account No is required.' },
    { type: 'maxlength', message: 'Account No should not be more than 20 characters.' }
  ],
  seqNo:[
    { type: 'required', message: 'Sequence No is required.' },
    { type: 'maxlength', message: 'Sequence No should not be more than 8 characters.' }
  ],
  bRCD:[
    { type: 'required', message: 'BRCD No is required.' },
    { type: 'maxlength', message: 'BRCD No should not be more than 8 characters.' }
  ],
  cDMid:[
    { type: 'required', message: 'CDMid No is required.' },
    { type: 'maxlength', message: 'CDMid No should not be more than 8 characters.' }
  ],
  paymentType:[
    { type: 'required', message: 'Please select a Payment Type.' }
  ],
  drugType:[
    { type: 'required', message: 'Drug Type is required.' }
  ],
  mailingAddress: [
    { type: 'email', message: 'Please enter a valid Email Address.' }
  ],
  extras: [
    { type: 'required', message: 'Field should not be empty.' }
  ],
  procName: [
    { type: 'required', message: 'Procedure name is required.' }
  ],
  procType: [
    { type: 'required', message: 'Procedure Type is required.' }
  ],
  defaultPrice: [
    { type: 'required', message: 'Default Price is required.' },
    // { type: 'pattern', message: 'Default Price should be a number value.' },
    { type: 'pattern', message: 'Default Price should be only Integer/2 Decimal Places Value.' }
  ],
  procedureCost: [
    // { type: 'pattern', message: 'Procedure Cost should be a number value.' },
    { type: 'pattern', message: 'Procedure Cost should be only Integer/2 Decimal Places Value.' }
  ],
  procedureDescription: [
    { type: 'maxlength', message: 'Field should not be more than 120 characters.' }
  ],
  labName: [
    { type: 'required', message: 'Lab name is required.' }
  ],
  labType: [
    { type: 'required', message: 'Lab Type is required.' }
  ],
  costPrice: [
    { type: 'required', message: 'Cost Price is required.' },
    // { type: 'pattern', message: 'Cost Price should be a number value.' },
    { type: 'pattern', message: 'Cost Price should be only Integer/2 Decimal Places Value.' }
  ],
  price: [
    { type: 'required', message: 'Price is required.' },
    { type: 'pattern', message: 'Price should be only Integer/2 Decimal Places Value.' }
  ],
  imgName: [
    { type: 'required', message: 'Image name is required.' }
  ],
  imgType: [
    { type: 'required', message: 'Image Type is required.' }
  ],
  cost: [
    { type: 'required', message: 'Cost is required.' },
    // { type: 'pattern', message: 'Cost should be a number value.' },
    { type: 'pattern', message: 'Cost should be only Integer/2 Decimal Places Value.' }
  ],
  defaultPricing: [
    { type: 'required', message: 'Default Price is required.' },
    { type: 'pattern', message: 'Default Price should be only Integer/2 Decimal Places Value.' }
  ],
  consultantName: [
    { type: 'required', message: 'Consultant name is required.' }
  ],
  specialization: [
    { type: 'required', message: 'Specialization is required.' }
  ],
  address: [
    { type: 'required', message: 'Address is required.' },
    { type: 'pattern', message: 'No empty space is allowed.' },
    { type: 'maxlength', message: 'Address Should not be more than 150 Characters.' },
  ],
  country: [
    { type: 'required', message: 'Country is required.' }
  ],
  userRole: [
    { type: 'required', message: 'User Role is required.' }
  ],
  userName: [
    { type: 'required', message: 'User Name is required.' },
    { type: 'pattern', message: 'No empty space and any number is allowed.' }
  ],
  userId: [
    { type: 'required', message: 'User Id is required.' },
    { type: 'pattern', message: 'Space is not allowed.' },
    { type: 'userIdTaken', message: 'This User Id is already exists.' },
    { type: 'UserIdCheckFailed', message: 'Could not validate User Id. Please try again.' }
  ],
  userPassword: [
    { type: 'required', message: 'User Password is required.' },
    { type: 'pattern', message: 'Please enter a valid User Password with atleast 6 characters and no space allowed.' }
    // { type: 'minlength', message: 'User Password should be atleast 6 characters with 1 alphabet.' }
  ],
  employeeCode: [
    { type: 'required', message: 'Employee Code is required.' }
  ],
  icNo: [
    { type: 'required', message: 'IC number is required.' }
  ],
  brandName: [
    { type: 'required', message: 'Brand Name is required.' }
  ],
  pharmaName: [
    { type: 'required', message: 'Pharma Name is required.' }
  ],
  DrugGroupListId: [
    { type: 'required', message: 'Group Name is required.' }
  ],

  removePerson: [
    { type: 'required', message: 'Remove Person is required.' }
  ],
  provider: [
    { type: 'required', message: 'Provider is required.' }
  ],
  cash:[
    { type: 'required', message: 'Cash field is required.' }
  ],
  card:[
    { type: 'required', message: 'Card field is required.' }
  ],
  total:[
    { type: 'required', message: 'Total field is required.' }
  ],
  panelName:[
    { type: 'required', message: 'Panel Name is required.' }
  ],
  employeeNo:[
    { type: 'required', message: 'Employee No is required.' }
  ],
  visitLimit:[
    { type: 'required', message: 'Visit Limit is required.' }
  ],
  cardNo:[
    { type: 'required', message: 'Card No is required.' }
  ],
  reason:[
    { type: 'required', message: 'Reason is required.' }
  ],
  addCampanion:[
    { type: 'required', message: 'Add Campanion is required.' }
  ],
  nric:[
    { type: 'required', message: 'NRIC is required.' }
  ],
  relationToPatients:[
    { type: 'required', message: 'Relation To Patients is required.' }
  ],
  comment:[
    { type: 'required', message: 'Note is required.' }
  ],
  updateAllergies:[
    { type: 'required', message: 'Please select atlease one Allergy.' }
  ],
  bp:[
    { type: 'required', message: 'BP is required.' }
  ],
  oxygen:[
    { type: 'required', message: 'Oxygen is required.' }
  ],
  pulse:[
    { type: 'required', message: 'Pulse is required.' }
  ],
  temp:[
    { type: 'required', message: 'Temp is required.' }
  ],
  bloodGlucose:[
    { type: 'required', message: 'Blood Glucose is required.' }
  ],
  lmp:[
    { type: 'required', message: 'LMP is required.' },
    { type: 'inValidLmp', message: 'Please enter a valid LMP' }
  ],
  bpSystolic:[
    { type: 'required', message: 'Bp Systolic is required.' }
  ],
  bpDiastolic:[
    { type: 'required', message: 'BP Diastolic is required.' }
  ],
  pratice:[
    { type: 'required', message: 'Pratice is required.' }
  ],
  insuredName:[
    { type: 'required', message: 'Insured Name is required.' }
  ],
  icNumber:[
    { type: 'required', message: 'Ic Number is required.' }
  ],
  cellNo:[
    { type: 'required', message: 'Cell No is required.' }
  ],
  selectPanel:[
    { type: 'required', message: 'Select Panel is required.' }
  ],
  packageName: [
    { type: 'required', message: 'Package Name is required.' }
  ],
  selectCompany :[
    { type: 'required', message: 'Select Company is required.' }
  ],
  // Patient Registration
  Id: [
    { type: 'required', message: 'Id is required.' }
  ],
  RegisteredDate: [
    { type: 'required', message: 'Registered Date is required.' }
  ],
  PTName: [
    { type: 'required', message: 'PT Name is required.' }
  ],
  MyKad: [
    { type: 'required', message: 'IC/MyKad No. is required.' },
    { type: 'icMykadTaken', message: 'This IC/MyKad No. is is already registered.' },
    { type: 'mykadCheckFailed', message: 'Could not validate Mykad. Please try again.' },
    { type: 'pattern', message: 'Please enter a valid IC/MyKad No.' },
    { type: 'minlength', message: 'IC/MyKad No. must be minimum 6 characters' },
    { type: 'maxlength', message: 'IC/MyKad No. must be maximum 12 characters' },
  ],
  DOB: [
    { type: 'required', message: 'DOB is required.' }
  ],
  Age: [
    { type: 'required', message: 'Age is required.' }
  ],
  Gender: [
    { type: 'required', message: 'Gender is required.' }
  ],
  Race: [
    { type: 'required', message: 'Race is required.' }
  ],
  Nationality: [
    { type: 'required', message: 'Nationality is required.' }
  ],
  MobilePhone: [
    { type: 'required', message: 'Phone Number is required.' },
    { type: 'minlength', message: 'Phone Number must be minimum 10 characters' },
    { type: 'maxlength', message: 'Phone Number must be maximum 14 characters' },
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  CellPhone: [
    { type: 'required', message: 'Phone Number is required.' },
    { type: 'minlength', message: 'Phone Number must be minimum 10 characters' },
    { type: 'maxlength', message: 'Phone Number must be maximum 14 characters' },
    { type: 'pattern', message: 'Only numbers are allowed' },
  ],
  PaymentMode: [
    { type: 'required', message: 'PaymentMode is required.' }
  ],
  PanelInsuranceId: [
    { type: 'required', message: 'PanelInsuranceId is required.' }
  ],
  CorpCompanyId: [
    { type: 'required', message: 'CorpCompanyId is required.' }
  ],
  InsuredName: [
    { type: 'required', message: 'InsuredName is required.' }
  ],
  InsuredMyKad: [
    { type: 'required', message: 'InsuredMyKad is required.' }
  ],
  CellNumber: [
    { type: 'required', message: 'CellNumber is required.' }
  ],
  IsInsured: [
    { type: 'required', message: 'IsInsured is required.' }
  ],
  ohdDoctorId: [
    { type: 'required', message: 'OHD Doctor is required.' }
  ],
  typeTestListId: [
    { type: 'required', message: 'Choose any one of the above type.' }
  ],
  Weight: [
    { type: 'required', message: 'Weight is required.' },
    { type: 'pattern', message: 'Only numbers are allowed.' },
    { type: 'max', message: 'Maximum Weight can be 150.' }
  ],
  Height: [
    { type: 'required', message: 'Height is required.' },
    { type: 'pattern', message: 'Only numbers are allowed.' },
    { type: 'max', message: 'Maximum Height can be 250.' }
  ],
  BMI: [
    { type: 'required', message: 'BMI is required.' },
    { type: 'pattern', message: 'Only numbers are allowed.' }
  ],
  VaccineGivenDate: [
    { type: 'required', message: 'Vaccine Given Date is required.' },
    { type: 'matDatepickerParse', message: 'Please Choose valid date.' }
  ],
  BPSystolic: [
    { type: 'required', message: 'BPSystolic is required.' },
    { type: 'pattern', message: 'Only numbers are allowed.' }
  ],
  BPDiastolic: [
    { type: 'required', message: 'BPDiastolic is required.' },
    { type: 'pattern', message: 'Only numbers are allowed.' }
  ],
  BPAbnormal: [
    { type: 'required', message: 'BPAbnormal is required.' }
  ],
  BMIAbnormal: [
    { type: 'required', message: 'BMIAbnormal is required.' }
  ],
  WaistCir: [
    { type: 'pattern', message: 'Only numbers are allowed.' }
  ],
  Pulse: [
    { type: 'pattern', message: 'Only numbers are allowed.' }
  ],
  Oxygen: [
    { type: 'pattern', message: 'Only numbers are allowed.' },
    { type: 'max', message: 'Maximum Oxygen level can be 100.' }
  ],
  Glucose: [
    { type: 'pattern', message: 'Only numbers are allowed.' }
  ],
  BodyTemp: [
    { type: 'pattern', message: 'Only numbers are allowed.' }
  ],
  Complaint: [
    { type: 'required', message: 'Complaint is required.' }
  ],
  Examination: [
    { type: 'required', message: 'Examination is required.' }
  ],
  surcharge: [
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  PurchaseCost: [
    { type: 'required', message: 'Purchase Cost is required.' },
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  SellPrice: [
    { type: 'required', message: 'Cash Sell Price is required.' },
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  PanelSellPrice: [
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  MiCarePrice: [
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  SellQty: [
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  ReStockThresholdQty: [
    { type: 'pattern', message: 'Only Integer/2 Decimal Places Value is allowed.' }
  ],
  minAmount: [
    { type: 'required', message: 'Please enter minimum value.' },
    { type: 'min', message: 'Minimum value is 0' }
  ],
  VerificationCode: [
    { type: 'required', message: 'Please enter Verification Code.' }
  ],
  WorkerCode: [
    { type: 'required', message: 'Please enter Worker Code.' }
  ],
  changePassword: [
    { type: 'required', message: 'Password is required.' },
    { type: 'pattern', message: 'Please enter a valid Password with atleast 6 characters and no space allowed.' }
  ],
  confirmPassword: [
    { type: 'required', message: 'Password is required.' },
    { type: 'pattern', message: 'Please enter a valid Password with atleast 6 characters and no space allowed.' },
    { type: 'notEqual', message: 'Password mismatch' }
  ],
};
// matDatepickerParse
