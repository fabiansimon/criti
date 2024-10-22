export class REGEX {
  static email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  static timestamp = /^([0-5][0-9]):([0-5][0-9])$/;
  static roomPassword = /^.{4,}$/;
  static userPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
}
