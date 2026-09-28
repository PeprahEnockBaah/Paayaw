// GPM's details for giving without the online checkout.
// Fill these in and the "Other ways to give" section appears on the Give page.
// Leave a value as '' to hide that item.

export const MOMO_DETAILS = {
  network: '', // e.g. 'MTN Mobile Money'
  number: '', // e.g. '024 000 0000'
  name: '', // registered account name
}

export const BANK_DETAILS = {
  bank: '', // e.g. 'GCB Bank'
  accountName: '',
  accountNumber: '',
  branch: '',
}

export const hasMomoDetails = () => !!MOMO_DETAILS.number
export const hasBankDetails = () => !!BANK_DETAILS.accountNumber
