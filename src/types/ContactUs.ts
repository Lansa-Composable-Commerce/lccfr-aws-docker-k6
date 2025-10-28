export interface Topic {
  emailName: string;
  emailAddress: string;
}

export interface ContactUsInformation {
  customerFirstName: string;
  customerLastName: string;
  customerEmailAddress: string;
  customerContactNumber: string;
  topicEmailName: string;
  topicEmailAddress: string;
  emailBody: string;
  orderNumber?: string;
  invoiceNumber?: string;
}
