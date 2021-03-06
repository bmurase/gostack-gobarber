import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (user.email !== email && userWithSameEmail) {
      throw new AppError('E-mail address already used');
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!old_password) {
        throw new AppError('Enter old password to confirm update.');
      }

      const rightPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!rightPassword) {
        throw new AppError('Wrong old password.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
