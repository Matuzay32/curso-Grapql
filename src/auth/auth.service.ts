import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtInterface } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async singUp(authCredentials: AuthCredentialsDto): Promise<{}> {
    const { username, password } = authCredentials;

    //hash de password  con bcrypt
    //salt
    const salt = await bcrypt.genSalt();
    // paso como parametro la pass y el salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // despues paso el hashedpass como el valor de password
    const newUser = await this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(newUser);
      return {
        userCreated:"success"
      }
               
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(
          'The username is already exist en la base de datos',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async singIn(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ accesToken: string }> {
    const { password, username } = authCredentials;
    const user = await this.userRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
    

      //JWT Pay load
      const payload: JwtInterface = { username };
      const accesToken: string = this.jwtService.sign(payload);
      return { accesToken };
    } else {
      throw new UnauthorizedException('Please check your loggin credentials');
    }
  }
}
