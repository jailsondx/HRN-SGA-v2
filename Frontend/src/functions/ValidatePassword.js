export function validatePassword(password) {

  //Aceita Char Especial
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#?]{8,}$/;

  //Nao aceitar CHAR especial
  //const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  return regex.test(password);
};
