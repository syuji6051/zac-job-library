export const setUserId = (header: { [name: string]: string}, userId: string) => ({ ...header, 'x-zac-user-info-user-id': userId });

export const getUserId = (header: { [name: string]: string}) => header['x-zac-user-info-user-id'];
