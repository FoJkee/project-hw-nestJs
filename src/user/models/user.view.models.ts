export class UserViewModels {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string = new Date().toISOString(),
    public passwordHash: string,
    public emailConfirmation: {
      codeConfirmation: string;
      expirationDate: string;
      isConfirmed: boolean;
    },
  ) {}
}
