import mongoose, { ClientSession, Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

export const MongooseTransaction = async <T>(
  connection: Connection,
  cb: (session: ClientSession) => Promise<T>,
): Promise<T> => {
  const session = await connection.startSession();

  try {
    session.startTransaction();
    const result = await cb(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export const comparePassword = async (
  providedPassword: string,
  storedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(providedPassword, storedPassword);
  } catch (error) {
    throw error;
  }
};

export function setObjectTypeId(id: string): any {
  const validObjectId = new mongoose.Types.ObjectId(id);
  return validObjectId;
}

export function formatIDRCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return formatter.format(amount);
}

export function isString(value: any) {
  return typeof value === 'string';
}

export function getJwtKey() {
  return process.env.JWT_KEY ?? '';
}

export function getJwtTTL() {
  return parseInt(process.env.JWT_TTL) ?? undefined;
}

export function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function resetCookie(res: Response, key: string) {
  res.cookie(key, '', { expires: new Date(0) });
  res.cookie(key, '', { expires: new Date(0) });
}

export function setCookie(res: Response, key: string, value: string) {
  res.cookie(key, value, {
    secure: true,
    maxAge: getJwtTTL(),
  });
}