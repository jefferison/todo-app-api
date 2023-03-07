import { validate, ValidateNested } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './user.dto';

describe('CreateUserDto', () => {
  it('should create a valid instance of CreateUserDto', async () => {
    const input = { username: 'johndoe', password: 'password' };
    const dto = plainToClass(CreateUserDto, input);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});