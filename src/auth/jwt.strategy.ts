import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { JwtInterface } from "./jwt-payload.interface";
import { UserEntity } from "./user.entity";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService:JwtService
      ) {
        super({
            secretOrKey:"secret",
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }
    async validate(payload:JwtInterface):Promise<UserEntity>{
       const {username} =payload

       const foundUser = this.userRepository.findOne({username});


       if(!foundUser){
           throw new UnauthorizedException();
           
       }
       return foundUser;
    }
}