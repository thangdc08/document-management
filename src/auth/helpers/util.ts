import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const comparePasswordHelper = async (password: string, hashPassword: string) => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        throw new BadRequestException('Error comparing password');
    }
}       