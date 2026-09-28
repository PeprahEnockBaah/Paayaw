// Book order settings, shared by the order page (client) and the server.
// No server-only imports here.

/** Charged once per order when the buyer picks delivery, in cedis. 0 = paid to the rider on delivery. */
export const DELIVERY_FEE_GHS = 0

/** Where pickup orders are collected. */
export const PICKUP_LOCATION = 'GPM International HQ, Old Abesim, Sunyani'

/** Most copies one order can include. */
export const MAX_QUANTITY = 20

export type Fulfilment = 'delivery' | 'pickup'

/** Link to a book's order page, e.g. for the slider's "Order Now" button. */
export const orderPath = (bookId: string) => `/order/${bookId}`
