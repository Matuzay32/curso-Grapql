import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/singup')
  singUp(@Body() authCredentialsDto: AuthCredentialsDto) {

    console.log(authCredentialsDto);

    return this.authService.singUp(authCredentialsDto);
  }


  @Post("/singin")
  singIn(@Body() authCredentialsDto:AuthCredentialsDto):Promise<{accesToken:string}>{

    return  this.authService.singIn(authCredentialsDto);

  }


}
