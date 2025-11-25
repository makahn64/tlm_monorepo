interface ProviderData {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  phoneNumber: string;
  providerId: string;
}

export interface MockUser {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  providerData: ProviderData[]
}

export const MOCK_USER: MockUser = {
  "uid": "nUFGnr075lgQVBreNNzrY55qtTm1",
  "displayName": "Mock Mitch",
  "photoURL": "http://photos.com",
  "email": "makahn64@gmail.com",
  "providerData": [
    {
      "uid": "makahn64@gmail.com",
      "displayName": "Mock Mitch",
      "photoURL": "http://photos.com",
      "email": "makahn64@gmail.com",
      "phoneNumber": '12345657',
      "providerId": "password"
    }
  ]
}
