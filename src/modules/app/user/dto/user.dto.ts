import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

// enum REGISTRATION_STATUS {
//     ACTIVE = 'active',
//     INACTIVE = 'inactive'
// }

export class UserDTO {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MaxLength(7)
    readonly firstName: string;

    @IsNotEmpty()
    @MaxLength(7)
    readonly lastName: string;


    @IsNotEmpty()
    readonly phoneNumber: string;

    // Un-comment in future if needed
    // @IsNotEmpty()
    // @IsEnum(REGISTRATION_STATUS)

    readonly address: string;

    readonly role: string;

    readonly registration_status: string;

    readonly password: string;

    readonly verificationLink: string;

    readonly profilePic: string;

    readonly resetPasswordCode: string;
}

